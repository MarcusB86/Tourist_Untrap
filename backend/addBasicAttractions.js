const { Attraction } = require('./models');

const basicAttractions = [
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
    rating: 4.6,
    googlePlaceId: "statue_of_liberty_nyc",
    isActive: true
  },
  {
    name: "Central Park",
    description: "Urban oasis with walking trails, lakes, and recreational facilities",
    category: "park",
    address: "Central Park, New York, NY, USA",
    latitude: 40.7829,
    longitude: -73.9654,
    openingHours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "22:00" },
      saturday: { open: "06:00", close: "22:00" },
      sunday: { open: "06:00", close: "22:00" }
    },
    averageWaitTime: 0,
    capacity: 50000,
    priceRange: "free",
    rating: 4.8,
    googlePlaceId: "central_park_nyc",
    isActive: true
  }
];

async function addBasicAttractions() {
  try {
    console.log('🔍 Adding basic attractions to database...');
    
    for (const attractionData of basicAttractions) {
      const [attraction, created] = await Attraction.findOrCreate({
        where: { googlePlaceId: attractionData.googlePlaceId },
        defaults: attractionData
      });
      
      if (created) {
        console.log(`✅ Added: ${attraction.name}`);
      } else {
        console.log(`⏭️ Skipped (already exists): ${attraction.name}`);
      }
    }
    
    console.log('🎉 Basic attractions added successfully!');
    
    // Count total attractions
    const count = await Attraction.count();
    console.log(`📊 Total attractions in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error adding attractions:', error);
  } finally {
    process.exit(0);
  }
}

addBasicAttractions();
