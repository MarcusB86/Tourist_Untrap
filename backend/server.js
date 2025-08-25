const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const attractionRoutes = require('./routes/attractions');
const crowdRoutes = require('./routes/crowd');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://touristuntrap.netlify.app',
    'https://tourist-untrap.netlify.app',
    'https://tourist-untrap-1.netlify.app',
    'https://*.netlify.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Test database connection and add basic data
app.get('/setup', async (req, res) => {
  try {
    const { Attraction } = require('./models');
    
    // Test database connection
    await require('./models').sequelize.authenticate();
    
    // Add basic attractions if none exist
    const count = await Attraction.count();
    if (count === 0) {
      const basicAttractions = [
        {
          name: "Times Square",
          description: "Famous commercial intersection and tourist destination in Midtown Manhattan",
          category: "landmark",
          address: "Manhattan, NY 10036, USA",
          latitude: 40.7580,
          longitude: -73.9855,
          openingHours: { monday: { open: "00:00", close: "23:59" } },
          averageWaitTime: 0,
          capacity: 10000,
          priceRange: "free",
          rating: 4.3,
          googlePlaceId: "times_square_nyc",
          isActive: true
        },
        {
          name: "Central Park",
          description: "Urban oasis with walking trails, lakes, and recreational facilities",
          category: "park",
          address: "Central Park, New York, NY, USA",
          latitude: 40.7829,
          longitude: -73.9654,
          openingHours: { monday: { open: "06:00", close: "22:00" } },
          averageWaitTime: 0,
          capacity: 50000,
          priceRange: "free",
          rating: 4.8,
          googlePlaceId: "central_park_nyc",
          isActive: true
        }
      ];
      
      for (const attractionData of basicAttractions) {
        await Attraction.create(attractionData);
      }
      
      res.json({ 
        message: 'Database connected and basic attractions added!',
        attractionsAdded: basicAttractions.length,
        totalAttractions: await Attraction.count()
      });
    } else {
      res.json({ 
        message: 'Database connected!',
        totalAttractions: count
      });
    }
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      message: 'Setup failed',
      error: error.message 
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/crowd', crowdRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
async function startServer() {
  try {
    console.log('🔍 Attempting to connect to database...');
    console.log('📊 Environment:', process.env.NODE_ENV);
    console.log('🗄️ Database URL:', process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synced.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
}

startServer();

module.exports = app; 