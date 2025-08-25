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
    const { Attraction, sequelize } = require('./models');
    
    // Test database connection and sync tables
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    // Add basic attractions if none exist
    const count = await Attraction.count();
    if (count === 0) {
      const nycAttractions = [
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
          name: "Statue of Liberty",
          description: "Iconic neoclassical sculpture on Liberty Island in New York Harbor",
          category: "landmark",
          address: "Liberty Island, New York, NY 10004, USA",
          latitude: 40.6892,
          longitude: -74.0445,
          openingHours: { monday: { open: "08:30", close: "16:00" } },
          averageWaitTime: 90,
          capacity: 3000,
          priceRange: "medium",
          rating: 4.6,
          googlePlaceId: "statue_of_liberty_nyc",
          isActive: true
        },
        {
          name: "Empire State Building",
          description: "102-story Art Deco skyscraper with observation decks",
          category: "landmark",
          address: "20 W 34th St, New York, NY 10001, USA",
          latitude: 40.7484,
          longitude: -73.9857,
          openingHours: { monday: { open: "08:00", close: "23:00" } },
          averageWaitTime: 45,
          capacity: 2000,
          priceRange: "high",
          rating: 4.4,
          googlePlaceId: "empire_state_building_nyc",
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
        },
        {
          name: "Metropolitan Museum of Art",
          description: "World-famous art museum with vast collections spanning 5,000+ years",
          category: "museum",
          address: "1000 5th Ave, New York, NY 10028, USA",
          latitude: 40.7794,
          longitude: -73.9632,
          openingHours: { monday: { open: "10:00", close: "17:00" } },
          averageWaitTime: 20,
          capacity: 5000,
          priceRange: "low",
          rating: 4.7,
          googlePlaceId: "met_museum_nyc",
          isActive: true
        },
        {
          name: "Brooklyn Bridge",
          description: "Iconic hybrid cable-stayed/suspension bridge connecting Manhattan and Brooklyn",
          category: "landmark",
          address: "Brooklyn Bridge, New York, NY 10038, USA",
          latitude: 40.7061,
          longitude: -73.9969,
          openingHours: { monday: { open: "00:00", close: "23:59" } },
          averageWaitTime: 0,
          capacity: 10000,
          priceRange: "free",
          rating: 4.5,
          googlePlaceId: "brooklyn_bridge_nyc",
          isActive: true
        },
        {
          name: "American Museum of Natural History",
          description: "World-renowned museum featuring dinosaur fossils and natural science exhibits",
          category: "museum",
          address: "200 Central Park West, New York, NY 10024, USA",
          latitude: 40.7813,
          longitude: -73.9740,
          openingHours: { monday: { open: "10:00", close: "17:30" } },
          averageWaitTime: 30,
          capacity: 4000,
          priceRange: "low",
          rating: 4.6,
          googlePlaceId: "amnh_nyc",
          isActive: true
        },
        {
          name: "Rockefeller Center",
          description: "Complex of 19 commercial buildings with the famous Christmas tree and ice rink",
          category: "landmark",
          address: "45 Rockefeller Plaza, New York, NY 10111, USA",
          latitude: 40.7587,
          longitude: -73.9787,
          openingHours: { monday: { open: "06:00", close: "23:00" } },
          averageWaitTime: 15,
          capacity: 8000,
          priceRange: "free",
          rating: 4.4,
          googlePlaceId: "rockefeller_center_nyc",
          isActive: true
        },
        {
          name: "High Line",
          description: "Elevated linear park built on a former freight rail line",
          category: "park",
          address: "High Line, New York, NY, USA",
          latitude: 40.7480,
          longitude: -74.0048,
          openingHours: { monday: { open: "07:00", close: "22:00" } },
          averageWaitTime: 0,
          capacity: 3000,
          priceRange: "free",
          rating: 4.7,
          googlePlaceId: "high_line_nyc",
          isActive: true
        },
        {
          name: "Broadway",
          description: "Famous theater district known for world-class musicals and plays",
          category: "entertainment",
          address: "Broadway, New York, NY, USA",
          latitude: 40.7589,
          longitude: -73.9851,
          openingHours: { monday: { open: "10:00", close: "23:00" } },
          averageWaitTime: 60,
          capacity: 2000,
          priceRange: "high",
          rating: 4.8,
          googlePlaceId: "broadway_nyc",
          isActive: true
        },
        {
          name: "9/11 Memorial & Museum",
          description: "Memorial and museum dedicated to the September 11, 2001 attacks",
          category: "museum",
          address: "180 Greenwich St, New York, NY 10007, USA",
          latitude: 40.7115,
          longitude: -74.0134,
          openingHours: { monday: { open: "09:00", close: "20:00" } },
          averageWaitTime: 45,
          capacity: 2500,
          priceRange: "medium",
          rating: 4.7,
          googlePlaceId: "911_memorial_nyc",
          isActive: true
        },
        {
          name: "One World Trade Center",
          description: "Tallest building in the Western Hemisphere with observation deck",
          category: "landmark",
          address: "285 Fulton St, New York, NY 10007, USA",
          latitude: 40.7127,
          longitude: -74.0134,
          openingHours: { monday: { open: "09:00", close: "21:00" } },
          averageWaitTime: 60,
          capacity: 1500,
          priceRange: "high",
          rating: 4.5,
          googlePlaceId: "one_world_trade_nyc",
          isActive: true
        },
        {
          name: "Chelsea Market",
          description: "Popular food hall and shopping center in the Meatpacking District",
          category: "shopping",
          address: "75 9th Ave, New York, NY 10011, USA",
          latitude: 40.7421,
          longitude: -74.0061,
          openingHours: { monday: { open: "07:00", close: "22:00" } },
          averageWaitTime: 20,
          capacity: 2000,
          priceRange: "medium",
          rating: 4.4,
          googlePlaceId: "chelsea_market_nyc",
          isActive: true
        },
        {
          name: "Bryant Park",
          description: "Beautiful urban park with seasonal activities and free events",
          category: "park",
          address: "Bryant Park, New York, NY 10018, USA",
          latitude: 40.7536,
          longitude: -73.9832,
          openingHours: { monday: { open: "06:00", close: "22:00" } },
          averageWaitTime: 0,
          capacity: 5000,
          priceRange: "free",
          rating: 4.6,
          googlePlaceId: "bryant_park_nyc",
          isActive: true
        },
        {
          name: "Madison Square Garden",
          description: "Famous arena hosting sports events, concerts, and entertainment",
          category: "entertainment",
          address: "4 Pennsylvania Plaza, New York, NY 10001, USA",
          latitude: 40.7505,
          longitude: -73.9934,
          openingHours: { monday: { open: "09:00", close: "23:00" } },
          averageWaitTime: 30,
          capacity: 20000,
          priceRange: "high",
          rating: 4.3,
          googlePlaceId: "msg_nyc",
          isActive: true
        }
      ];
      
      for (const attractionData of nycAttractions) {
        await Attraction.create(attractionData);
      }
      
      res.json({ 
        message: 'Database connected and NYC attractions added!',
        attractionsAdded: nycAttractions.length,
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
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced.');
    
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