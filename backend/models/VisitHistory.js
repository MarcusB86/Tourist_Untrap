module.exports = (sequelize, DataTypes) => {
  const VisitHistory = sequelize.define('VisitHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    attractionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'attractions',
        key: 'id'
      }
    },
    visitDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    actualCrowdLevel: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      }
    },
    actualWaitTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Actual wait time in minutes'
    },
    predictedCrowdLevel: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 1
      }
    },
    predictedWaitTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Predicted wait time in minutes'
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      },
      comment: 'User rating of the visit experience (1-5)'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'User notes about the visit'
    },
    visitDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Duration of visit in minutes'
    },
    wasPlanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether this visit was planned in advance'
    },
    satisfaction: {
      type: DataTypes.ENUM('very_satisfied', 'satisfied', 'neutral', 'dissatisfied', 'very_dissatisfied'),
      allowNull: true
    },
    wouldRecommend: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Whether the user would recommend visiting at this time'
    }
  }, {
    tableName: 'visit_history',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'visitDate']
      },
      {
        fields: ['attractionId', 'visitDate']
      },
      {
        fields: ['wasPlanned']
      }
    ]
  });

  // Instance methods
  VisitHistory.prototype.getPredictionAccuracy = function() {
    if (!this.predictedCrowdLevel || !this.actualCrowdLevel) return null;
    return Math.abs(this.predictedCrowdLevel - this.actualCrowdLevel);
  };

  VisitHistory.prototype.getWaitTimeAccuracy = function() {
    if (!this.predictedWaitTime || !this.actualWaitTime) return null;
    return Math.abs(this.predictedWaitTime - this.actualWaitTime);
  };

  VisitHistory.prototype.isPredictionAccurate = function() {
    const accuracy = this.getPredictionAccuracy();
    return accuracy !== null && accuracy < 0.2; // Within 20% accuracy
  };

  return VisitHistory;
}; 