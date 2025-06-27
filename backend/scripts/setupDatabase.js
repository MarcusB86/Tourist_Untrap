const { sequelize, User, Attraction, CrowdData } = require('../models');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created');

    // Create sample attractions
    const attractions = await Attraction.bulkCreate([
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower on the Champ de Mars in Paris',
        category: 'landmark',
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        latitude: 48.8584,
        longitude: 2.2945,
        openingHours: {
          monday: { open: '09:00', close: '23:45' },
          tuesday: { open: '09:00', close: '23:45' },
          wednesday: { open: '09:00', close: '23:45' },
          thursday: { open: '09:00', close: '23:45' },
          friday: { open: '09:00', close: '23:45' },
          saturday: { open: '09:00', close: '23:45' },
          sunday: { open: '09:00', close: '23:45' }
        },
        averageWaitTime: 45,
        capacity: 1000,
        priceRange: 'medium',
        rating: 4.5
      },
      {
        name: 'Louvre Museum',
        description: 'World\'s largest art museum and a historic monument in Paris',
        category: 'museum',
        address: 'Rue de Rivoli, 75001 Paris, France',
        latitude: 48.8606,
        longitude: 2.3376,
        openingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '09:00', close: '18:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        averageWaitTime: 60,
        capacity: 2000,
        priceRange: 'medium',
        rating: 4.7
      },
      {
        name: 'Central Park',
        description: 'Urban oasis in the heart of Manhattan',
        category: 'park',
        address: 'New York, NY 10024, USA',
        latitude: 40.7829,
        longitude: -73.9654,
        openingHours: {
          monday: { open: '06:00', close: '22:00' },
          tuesday: { open: '06:00', close: '22:00' },
          wednesday: { open: '06:00', close: '22:00' },
          thursday: { open: '06:00', close: '22:00' },
          friday: { open: '06:00', close: '22:00' },
          saturday: { open: '06:00', close: '22:00' },
          sunday: { open: '06:00', close: '22:00' }
        },
        averageWaitTime: 0,
        capacity: 5000,
        priceRange: 'free',
        rating: 4.6
      }
    ]);

    console.log('✅ Sample attractions created');

    // Create sample crowd data
    const now = new Date();
    const crowdData = [];

    for (const attraction of attractions) {
      // Create sample data for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Create data for different hours
        for (let hour = 9; hour <= 20; hour += 2) {
          const timestamp = new Date(date);
          timestamp.setHours(hour, 0, 0, 0);
          
          // Generate realistic crowd levels based on time
          let crowdLevel;
          if (hour < 11 || hour > 18) {
            crowdLevel = 0.2 + Math.random() * 0.3; // Low crowds
          } else if (hour >= 11 && hour <= 14) {
            crowdLevel = 0.6 + Math.random() * 0.3; // Medium-high crowds
          } else {
            crowdLevel = 0.4 + Math.random() * 0.4; // Medium crowds
          }

          crowdData.push({
            attractionId: attraction.id,
            crowdLevel: Math.round(crowdLevel * 100) / 100,
            waitTime: Math.floor(Math.random() * 60),
            timestamp,
            dayOfWeek: timestamp.getDay(),
            hourOfDay: hour,
            isHoliday: false,
            weatherCondition: 'sunny',
            temperature: 20 + Math.random() * 10,
            dataSource: 'prediction',
            confidence: 0.8
          });
        }
      }
    }

    await CrowdData.bulkCreate(crowdData);
    console.log('✅ Sample crowd data created');

    console.log('🎉 Database setup completed successfully!');
    console.log(`📊 Created ${attractions.length} attractions`);
    console.log(`📈 Created ${crowdData.length} crowd data entries`);

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase(); 