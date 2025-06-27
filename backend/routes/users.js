const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { User, VisitHistory, Attraction } = require('../models');

const router = express.Router();

// Middleware to check if user is authenticated
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user preferences
router.put('/preferences', [
  authenticateToken,
  body('preferences').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { preferences } = req.body;
    const currentPreferences = req.user.preferences || {};

    // Merge preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences
    };

    // Validate preference values
    if (updatedPreferences.preferredCrowdLevel && 
        !['low', 'medium', 'high'].includes(updatedPreferences.preferredCrowdLevel)) {
      return res.status(400).json({ message: 'Invalid preferred crowd level' });
    }

    if (updatedPreferences.maxWaitTime && 
        (updatedPreferences.maxWaitTime < 0 || updatedPreferences.maxWaitTime > 300)) {
      return res.status(400).json({ message: 'Invalid max wait time' });
    }

    await req.user.update({ preferences: updatedPreferences });

    res.json({
      message: 'Preferences updated successfully',
      user: req.user.toJSON()
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user visit history
router.get('/visits', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const visits = await VisitHistory.findAndCountAll({
      where: { userId: req.user.id },
      include: [{
        model: Attraction,
        attributes: ['name', 'category', 'address']
      }],
      order: [['visitDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      visits: visits.rows,
      total: visits.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get visits error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add visit record
router.post('/visits', [
  authenticateToken,
  body('attractionId').isUUID(),
  body('visitDate').isISO8601(),
  body('actualCrowdLevel').optional().isFloat({ min: 0, max: 1 }),
  body('actualWaitTime').optional().isInt({ min: 0 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('notes').optional().isString().isLength({ max: 1000 }),
  body('visitDuration').optional().isInt({ min: 1 }),
  body('wasPlanned').optional().isBoolean(),
  body('satisfaction').optional().isIn(['very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied']),
  body('wouldRecommend').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      attractionId,
      visitDate,
      actualCrowdLevel,
      actualWaitTime,
      rating,
      notes,
      visitDuration,
      wasPlanned,
      satisfaction,
      wouldRecommend
    } = req.body;

    // Verify attraction exists
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    // Get prediction for comparison
    const predictedCrowdLevel = await attraction.getCrowdPrediction(new Date(visitDate));

    const visit = await VisitHistory.create({
      userId: req.user.id,
      attractionId,
      visitDate: new Date(visitDate),
      actualCrowdLevel,
      actualWaitTime,
      predictedCrowdLevel: predictedCrowdLevel === 'low' ? 0.3 : 
                          predictedCrowdLevel === 'medium' ? 0.6 : 0.9,
      rating,
      notes,
      visitDuration,
      wasPlanned: wasPlanned || false,
      satisfaction,
      wouldRecommend
    });

    res.status(201).json({
      message: 'Visit recorded successfully',
      visit
    });
  } catch (error) {
    console.error('Add visit error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { days = 365 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const visits = await VisitHistory.findAll({
      where: {
        userId: req.user.id,
        visitDate: { $gte: startDate }
      },
      include: [{
        model: Attraction,
        attributes: ['category']
      }]
    });

    const totalVisits = visits.length;
    const plannedVisits = visits.filter(v => v.wasPlanned).length;
    const averageRating = visits
      .filter(v => v.rating)
      .reduce((sum, v) => sum + v.rating, 0) / visits.filter(v => v.rating).length || 0;

    const categoryStats = {};
    visits.forEach(visit => {
      const category = visit.Attraction.category;
      if (!categoryStats[category]) {
        categoryStats[category] = 0;
      }
      categoryStats[category]++;
    });

    const predictionAccuracy = visits
      .filter(v => v.actualCrowdLevel && v.predictedCrowdLevel)
      .map(v => Math.abs(v.actualCrowdLevel - v.predictedCrowdLevel))
      .reduce((sum, accuracy) => sum + accuracy, 0) / 
      visits.filter(v => v.actualCrowdLevel && v.predictedCrowdLevel).length || 0;

    res.json({
      stats: {
        totalVisits,
        plannedVisits,
        averageRating,
        categoryStats,
        predictionAccuracy: 1 - predictionAccuracy, // Convert to accuracy percentage
        timeRange: `${days} days`
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 