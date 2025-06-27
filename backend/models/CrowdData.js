module.exports = (sequelize, DataTypes) => {
  const CrowdData = sequelize.define('CrowdData', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    attractionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'attractions',
        key: 'id'
      }
    },
    crowdLevel: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 1
      },
      comment: 'Crowd level as a decimal between 0 (empty) and 1 (full capacity)'
    },
    waitTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Wait time in minutes'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6
      },
      comment: '0 = Sunday, 1 = Monday, etc.'
    },
    hourOfDay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 23
      }
    },
    isHoliday: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    weatherCondition: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Weather condition (sunny, rainy, etc.)'
    },
    temperature: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
      comment: 'Temperature in Celsius'
    },
    dataSource: {
      type: DataTypes.ENUM('user_report', 'api', 'prediction', 'sensor'),
      allowNull: false,
      defaultValue: 'user_report'
    },
    confidence: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      },
      comment: 'Confidence level of the crowd data (0-1)'
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional metadata about the crowd data'
    }
  }, {
    tableName: 'crowd_data',
    timestamps: true,
    indexes: [
      {
        fields: ['attractionId', 'timestamp']
      },
      {
        fields: ['dayOfWeek', 'hourOfDay']
      },
      {
        fields: ['dataSource']
      }
    ]
  });

  // Instance methods
  CrowdData.prototype.getCrowdLevelDescription = function() {
    const level = this.crowdLevel;
    if (level < 0.2) return 'Very Low';
    if (level < 0.4) return 'Low';
    if (level < 0.6) return 'Moderate';
    if (level < 0.8) return 'High';
    return 'Very High';
  };

  CrowdData.prototype.getWaitTimeDescription = function() {
    if (!this.waitTime) return 'Unknown';
    if (this.waitTime < 10) return 'No Wait';
    if (this.waitTime < 30) return 'Short Wait';
    if (this.waitTime < 60) return 'Medium Wait';
    return 'Long Wait';
  };

  return CrowdData;
}; 