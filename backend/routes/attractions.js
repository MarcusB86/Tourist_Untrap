const express = require('express');
const { Op } = require('sequelize');
const { Attraction, CrowdData } = require('../models');

const router = express.Router();

// Get all attractions with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      lat,
      lng,
      radius = 10, // Default 10km radius
      limit = 20,
      offset = 0
    } = req.query;

    const whereClause = { isActive: true };

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Search by name or description
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Filter by location (if coordinates provided)
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);

      // Simple distance calculation (can be improved with PostGIS)
      whereClause[Op.and] = [
        { latitude: { [Op.between]: [latNum - radiusNum/111, latNum + radiusNum/111] } },
        { longitude: { [Op.between]: [lngNum - radiusNum/111, lngNum + radiusNum/111] } }
      ];
    }

    const attractions = await Attraction.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.json({
      attractions: attractions.rows,
      total: attractions.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get attractions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single attraction with crowd data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { includeCrowdData = 'false' } = req.query;

    const attraction = await Attraction.findByPk(id, {
      where: { isActive: true }
    });

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    const result = { attraction };

    // Include recent crowd data if requested
    if (includeCrowdData === 'true') {
      const crowdData = await CrowdData.findAll({
        where: { attractionId: id },
        order: [['timestamp', 'DESC']],
        limit: 24 // Last 24 data points
      });

      result.crowdData = crowdData;
    }

    res.json(result);
  } catch (error) {
    console.error('Get attraction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get crowd prediction for an attraction
router.get('/:id/prediction', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const attraction = await Attraction.findByPk(id);
    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    const targetDate = date ? new Date(date) : new Date();
    const prediction = await attraction.getCrowdPrediction(targetDate);

    res.json({
      attractionId: id,
      date: targetDate,
      predictedCrowdLevel: prediction,
      confidence: 0.8 // Placeholder confidence score
    });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get attraction categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Attraction.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const categoryList = categories.map(cat => cat.category);
    res.json({ categories: categoryList });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 