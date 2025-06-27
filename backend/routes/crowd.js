const express = require('express');
const { body, validationResult } = require('express-validator');
const { CrowdData, Attraction } = require('../models');

const router = express.Router();

// Get crowd data for an attraction
router.get('/attraction/:attractionId', async (req, res) => {
  try {
    const { attractionId } = req.params;
    const { 
      startDate, 
      endDate, 
      limit = 100,
      dataSource 
    } = req.query;

    const whereClause = { attractionId };

    // Filter by date range
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.$gte = new Date(startDate);
      if (endDate) whereClause.timestamp.$lte = new Date(endDate);
    }

    // Filter by data source
    if (dataSource) {
      whereClause.dataSource = dataSource;
    }

    const crowdData = await CrowdData.findAll({
      where: whereClause,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      include: [{
        model: Attraction,
        attributes: ['name', 'category']
      }]
    });

    res.json({
      attractionId,
      crowdData,
      total: crowdData.length
    });
  } catch (error) {
    console.error('Get crowd data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit crowd data (user report)
router.post('/report', [
  body('attractionId').isUUID(),
  body('crowdLevel').isFloat({ min: 0, max: 1 }),
  body('waitTime').optional().isInt({ min: 0 }),
  body('notes').optional().isString().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { attractionId, crowdLevel, waitTime, notes } = req.body;
    const now = new Date();

    // Verify attraction exists
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    // Create crowd data entry
    const crowdData = await CrowdData.create({
      attractionId,
      crowdLevel,
      waitTime,
      timestamp: now,
      dayOfWeek: now.getDay(),
      hourOfDay: now.getHours(),
      dataSource: 'user_report',
      confidence: 0.7, // User reports have medium confidence
      metadata: { notes }
    });

    res.status(201).json({
      message: 'Crowd data submitted successfully',
      crowdData
    });
  } catch (error) {
    console.error('Submit crowd data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get crowd predictions for multiple attractions
router.post('/predictions/batch', async (req, res) => {
  try {
    const { attractionIds, date } = req.body;

    if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
      return res.status(400).json({ message: 'attractionIds array is required' });
    }

    const targetDate = date ? new Date(date) : new Date();
    const predictions = [];

    for (const attractionId of attractionIds) {
      const attraction = await Attraction.findByPk(attractionId);
      if (attraction) {
        const prediction = await attraction.getCrowdPrediction(targetDate);
        predictions.push({
          attractionId,
          attractionName: attraction.name,
          predictedCrowdLevel: prediction,
          date: targetDate,
          confidence: 0.8
        });
      }
    }

    res.json({
      predictions,
      date: targetDate,
      total: predictions.length
    });
  } catch (error) {
    console.error('Batch predictions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get crowd statistics for an attraction
router.get('/stats/:attractionId', async (req, res) => {
  try {
    const { attractionId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const crowdData = await CrowdData.findAll({
      where: {
        attractionId,
        timestamp: { $gte: startDate }
      },
      attributes: [
        'crowdLevel',
        'waitTime',
        'dayOfWeek',
        'hourOfDay',
        'dataSource'
      ]
    });

    if (crowdData.length === 0) {
      return res.json({
        attractionId,
        stats: {
          averageCrowdLevel: 0,
          averageWaitTime: 0,
          totalReports: 0,
          peakHours: [],
          quietHours: []
        }
      });
    }

    // Calculate statistics
    const totalReports = crowdData.length;
    const averageCrowdLevel = crowdData.reduce((sum, data) => sum + data.crowdLevel, 0) / totalReports;
    const averageWaitTime = crowdData
      .filter(data => data.waitTime)
      .reduce((sum, data) => sum + data.waitTime, 0) / crowdData.filter(data => data.waitTime).length || 0;

    // Find peak and quiet hours
    const hourlyStats = {};
    crowdData.forEach(data => {
      const hour = data.hourOfDay;
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { total: 0, count: 0 };
      }
      hourlyStats[hour].total += data.crowdLevel;
      hourlyStats[hour].count += 1;
    });

    const hourlyAverages = Object.entries(hourlyStats).map(([hour, stats]) => ({
      hour: parseInt(hour),
      averageCrowdLevel: stats.total / stats.count
    }));

    hourlyAverages.sort((a, b) => b.averageCrowdLevel - a.averageCrowdLevel);
    const peakHours = hourlyAverages.slice(0, 3).map(h => h.hour);
    const quietHours = hourlyAverages.slice(-3).map(h => h.hour);

    res.json({
      attractionId,
      stats: {
        averageCrowdLevel,
        averageWaitTime,
        totalReports,
        peakHours,
        quietHours,
        hourlyAverages
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 