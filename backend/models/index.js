const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production: Use DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000
    }
  });
} else {
  // Development: Use individual variables
  sequelize = new Sequelize(
    process.env.DB_NAME || 'tourist_untrap',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Import models
const User = require('./User')(sequelize, Sequelize);
const Attraction = require('./Attraction')(sequelize, Sequelize);
const CrowdData = require('./CrowdData')(sequelize, Sequelize);
const VisitHistory = require('./VisitHistory')(sequelize, Sequelize);

// Define associations
User.hasMany(VisitHistory, { foreignKey: 'userId' });
VisitHistory.belongsTo(User, { foreignKey: 'userId' });

Attraction.hasMany(CrowdData, { foreignKey: 'attractionId' });
CrowdData.belongsTo(Attraction, { foreignKey: 'attractionId' });

Attraction.hasMany(VisitHistory, { foreignKey: 'attractionId' });
VisitHistory.belongsTo(Attraction, { foreignKey: 'attractionId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Attraction,
  CrowdData,
  VisitHistory
}; 