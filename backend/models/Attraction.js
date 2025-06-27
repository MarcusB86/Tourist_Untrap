module.exports = (sequelize, DataTypes) => {
  const Attraction = sequelize.define('Attraction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 200]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('museum', 'park', 'landmark', 'restaurant', 'shopping', 'entertainment', 'other'),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    openingHours: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Stores opening hours for each day of the week'
    },
    averageWaitTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Average wait time in minutes'
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum capacity of the attraction'
    },
    priceRange: {
      type: DataTypes.ENUM('free', 'low', 'medium', 'high'),
      allowNull: true
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 5
      }
    },
    googlePlaceId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    crowdPredictionModel: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Stores crowd prediction model parameters'
    }
  }, {
    tableName: 'attractions',
    timestamps: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['latitude', 'longitude']
      },
      {
        fields: ['googlePlaceId']
      }
    ]
  });

  // Instance methods
  Attraction.prototype.getCurrentCrowdLevel = async function() {
    const { CrowdData } = require('./index');
    const latestCrowdData = await CrowdData.findOne({
      where: { attractionId: this.id },
      order: [['timestamp', 'DESC']]
    });
    return latestCrowdData ? latestCrowdData.crowdLevel : null;
  };

  Attraction.prototype.getCrowdPrediction = async function(date) {
    // This would implement the crowd prediction algorithm
    // For now, return a simple prediction based on historical data
    const { CrowdData } = require('./index');
    const historicalData = await CrowdData.findAll({
      where: { 
        attractionId: this.id,
        timestamp: {
          [sequelize.Op.gte]: new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    if (historicalData.length === 0) return 'unknown';
    
    const averageCrowdLevel = historicalData.reduce((sum, data) => sum + data.crowdLevel, 0) / historicalData.length;
    
    if (averageCrowdLevel < 0.3) return 'low';
    if (averageCrowdLevel < 0.7) return 'medium';
    return 'high';
  };

  return Attraction;
}; 