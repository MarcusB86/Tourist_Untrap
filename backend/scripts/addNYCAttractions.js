const { Attraction, CrowdData } = require('../models');
const { v4: uuidv4 } = require('uuid');

const nycAttractions = [
  {
    name: "Times Square",
    description: "Famous commercial intersection and tourist destination in Midtown Manhattan",
    category: "landmark",
    address: "Manhattan, NY 10036, USA",
    latitude: 40.7580,
    longitude: -73.9855,
    openingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    averageWaitTime: 0,
    capacity: 10000,
    priceRange: "free",
    rating: 4.3
  },
  {
    name: "Statue of Liberty",
    description: "Iconic neoclassical sculpture on Liberty Island in New York Harbor",
    category: "landmark",
    address: "Liberty Island, New York, NY 10004, USA",
    latitude: 40.6892,
    longitude: -74.0445,
    openingHours: {
      monday: { open: "08:30", close: "16:00" },
      tuesday: { open: "08:30", close: "16:00" },
      wednesday: { open: "08:30", close: "16:00" },
      thursday: { open: "08:30", close: "16:00" },
      friday: { open: "08:30", close: "16:00" },
      saturday: { open: "08:30", close: "16:00" },
      sunday: { open: "08:30", close: "16:00" }
    },
    averageWaitTime: 90,
    capacity: 3000,
    priceRange: "medium",
    rating: 4.6
  },
  {
    name: "Empire State Building",
    description: "102-story Art Deco skyscraper with observation decks",
    category: "landmark",
    address: "20 W 34th St, New York, NY 10001, USA",
    latitude: 40.7484,
    longitude: -73.9857,
    openingHours: {
      monday: { open: "08:00", close: "23:00" },
      tuesday: { open: "08:00", close: "23:00" },
      wednesday: { open: "08:00", close: "23:00" },
      thursday: { open: "08:00", close: "23:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "08:00", close: "23:00" },
      sunday: { open: "08:00", close: "23:00" }
    },
    averageWaitTime: 45,
    capacity: 2000,
    priceRange: "high",
    rating: 4.4
  },
  {
    name: "Metropolitan Museum of Art",
    description: "World-famous art museum with vast collections spanning 5,000+ years",
    category: "museum",
    address: "1000 5th Ave, New York, NY 10028, USA",
    latitude: 40.7794,
    longitude: -73.9632,
    openingHours: {
      monday: { open: "10:00", close: "17:00" },
      tuesday: { open: "10:00", close: "17:00" },
      wednesday: { open: "10:00", close: "17:00" },
      thursday: { open: "10:00", close: "17:00" },
      friday: { open: "10:00", close: "21:00" },
      saturday: { open: "10:00", close: "17:00" },
      sunday: { open: "10:00", close: "17:00" }
    },
    averageWaitTime: 20,
    capacity: 5000,
    priceRange: "low",
    rating: 4.7
  },
  {
    name: "Brooklyn Bridge",
    description: "Iconic hybrid cable-stayed/suspension bridge connecting Manhattan and Brooklyn",
    category: "landmark",
    address: "Brooklyn Bridge, New York, NY 10038, USA",
    latitude: 40.7061,
    longitude: -73.9969,
    openingHours: {
      monday: { open: "00:00", close: "23:59" },
      tuesday: { open: "00:00", close: "23:59" },
      wednesday: { open: "00:00", close: "23:59" },
      thursday: { open: "00:00", close: "23:59" },
      friday: { open: "00:00", close: "23:59" },
      saturday: { open: "00:00", close: "23:59" },
      sunday: { open: "00:00", close: "23:59" }
    },
    averageWaitTime: 0,
    capacity: 8000,
    priceRange: "free",
    rating: 4.5
  },
  {
    name: "American Museum of Natural History",
    description: "World-renowned museum dedicated to human culture, natural world, and universe",
    category: "museum",
    address: "200 Central Park W, New York, NY 10024, USA",
    latitude: 40.7813,
    longitude: -73.9740,
    openingHours: {
      monday: { open: "10:00", close: "17:30" },
      tuesday: { open: "10:00", close: "17:30" },
      wednesday: { open: "10:00", close: "17:30" },
      thursday: { open: "10:00", close: "17:30" },
      friday: { open: "10:00", close: "17:30" },
      saturday: { open: "10:00", close: "17:30" },
      sunday: { open: "10:00", close: "17:30" }
    },
    averageWaitTime: 30,
    capacity: 4000,
    priceRange: "medium",
    rating: 4.6
  },
  {
    name: "High Line",
    description: "Elevated linear park built on a former freight rail line",
    category: "park",
    address: "New York, NY 10011, USA",
    latitude: 40.7480,
    longitude: -74.0048,
    openingHours: {
      monday: { open: "07:00", close: "22:00" },
      tuesday: { open: "07:00", close: "22:00" },
      wednesday: { open: "07:00", close: "22:00" },
      thursday: { open: "07:00", close: "22:00" },
      friday: { open: "07:00", close: "22:00" },
      saturday: { open: "07:00", close: "22:00" },
      sunday: { open: "07:00", close: "22:00" }
    },
    averageWaitTime: 0,
    capacity: 3000,
    priceRange: "free",
    rating: 4.4
  },
  {
    name: "Broadway",
    description: "Famous theater district known for live performances and musicals",
    category: "entertainment",
    address: "Broadway, New York, NY, USA",
    latitude: 40.7589,
    longitude: -73.9851,
    openingHours: {
      monday: { open: "10:00", close: "23:00" },
      tuesday: { open: "10:00", close: "23:00" },
      wednesday: { open: "10:00", close: "23:00" },
      thursday: { open: "10:00", close: "23:00" },
      friday: { open: "10:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "23:00" }
    },
    averageWaitTime: 60,
    capacity: 1500,
    priceRange: "high",
    rating: 4.8
  },
  {
    name: "Chelsea Market",
    description: "Popular food hall and shopping center in the Meatpacking District",
    category: "shopping",
    address: "75 9th Ave, New York, NY 10011, USA",
    latitude: 40.7421,
    longitude: -74.0061,
    openingHours: {
      monday: { open: "07:00", close: "21:00" },
      tuesday: { open: "07:00", close: "21:00" },
      wednesday: { open: "07:00", close: "21:00" },
      thursday: { open: "07:00", close: "21:00" },
      friday: { open: "07:00", close: "21:00" },
      saturday: { open: "07:00", close: "21:00" },
      sunday: { open: "08:00", close: "20:00" }
    },
    averageWaitTime: 15,
    capacity: 2000,
    priceRange: "medium",
    rating: 4.3
  },
  {
    name: "One World Trade Center",
    description: "Main building of the rebuilt World Trade Center complex",
    category: "landmark",
    address: "285 Fulton St, New York, NY 10007, USA",
    latitude: 40.7127,
    longitude: -74.0134,
    openingHours: {
      monday: { open: "09:00", close: "20:00" },
      tuesday: { open: "09:00", close: "20:00" },
      wednesday: { open: "09:00", close: "20:00" },
      thursday: { open: "09:00", close: "20:00" },
      friday: { open: "09:00", close: "20:00" },
      saturday: { open: "09:00", close: "20:00" },
      sunday: { open: "09:00", close: "20:00" }
    },
    averageWaitTime: 30,
    capacity: 1500,
    priceRange: "high",
    rating: 4.5
  }
];

async function generateCrowdData(attractionId, baseCrowdLevel, baseWaitTime) {
  const crowdData = [];
  const now = new Date();
  
  // Generate data for the past 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    const dayOfWeek = date.getDay();
    
    // Generate data for each hour (9 AM to 9 PM)
    for (let hour = 9; hour <= 21; hour++) {
      // Base crowd level varies by day and hour
      let crowdLevel = baseCrowdLevel;
      
      // Weekend crowds are higher
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        crowdLevel *= 1.3;
      }
      
      // Peak hours (11-15) have higher crowds
      if (hour >= 11 && hour <= 15) {
        crowdLevel *= 1.4;
      }
      
      // Evening hours (17-19) have moderate crowds
      if (hour >= 17 && hour <= 19) {
        crowdLevel *= 1.2;
      }
      
      // Add some randomness
      crowdLevel *= (0.8 + Math.random() * 0.4);
      crowdLevel = Math.min(1.0, Math.max(0.1, crowdLevel));
      
      // Calculate wait time based on crowd level
      let waitTime = Math.round(baseWaitTime * crowdLevel * (0.5 + Math.random() * 1.0));
      
      // Weather effect (random)
      const weatherConditions = ['sunny', 'cloudy', 'rainy', 'partly_cloudy'];
      const weatherCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const temperature = 15 + Math.random() * 20; // 15-35°C
      
      const timestamp = new Date(date);
      timestamp.setHours(hour, 0, 0, 0);
      
      crowdData.push({
        id: uuidv4(),
        attractionId,
        crowdLevel: parseFloat(crowdLevel.toFixed(2)),
        waitTime,
        timestamp,
        dayOfWeek,
        hourOfDay: hour,
        isHoliday: false,
        weatherCondition,
        temperature: parseFloat(temperature.toFixed(1)),
        dataSource: 'prediction',
        confidence: 0.8,
        metadata: {
          generated: true,
          baseCrowdLevel,
          baseWaitTime
        }
      });
    }
  }
  
  return crowdData;
}

async function addNYCAttractions() {
  try {
    console.log('🔄 Adding NYC attractions...');
    
    for (const attractionData of nycAttractions) {
      // Check if attraction already exists
      const existing = await Attraction.findOne({
        where: { name: attractionData.name }
      });
      
      if (existing) {
        console.log(`⏭️  ${attractionData.name} already exists, skipping...`);
        continue;
      }
      
      // Create attraction
      const attraction = await Attraction.create({
        id: uuidv4(),
        ...attractionData
      });
      
      console.log(`✅ Created ${attraction.name}`);
      
      // Generate crowd data
      const baseCrowdLevel = 0.4 + Math.random() * 0.3; // 0.4-0.7
      const baseWaitTime = attractionData.averageWaitTime || 20;
      
      const crowdData = await generateCrowdData(attraction.id, baseCrowdLevel, baseWaitTime);
      
      // Insert crowd data in batches
      const batchSize = 50;
      for (let i = 0; i < crowdData.length; i += batchSize) {
        const batch = crowdData.slice(i, i + batchSize);
        await CrowdData.bulkCreate(batch);
      }
      
      console.log(`📊 Added ${crowdData.length} crowd data entries for ${attraction.name}`);
    }
    
    console.log('🎉 NYC attractions added successfully!');
    
    // Show summary
    const totalAttractions = await Attraction.count();
    const totalCrowdData = await CrowdData.count();
    
    console.log(`📊 Total attractions: ${totalAttractions}`);
    console.log(`📈 Total crowd data entries: ${totalCrowdData}`);
    
  } catch (error) {
    console.error('❌ Error adding NYC attractions:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
addNYCAttractions(); 