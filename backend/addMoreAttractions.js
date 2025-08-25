const { Attraction } = require('./models');

const additionalAttractions = [
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
    googlePlaceId: "statue_of_liberty_nyc_2",
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
    googlePlaceId: "empire_state_building_nyc_2",
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
    googlePlaceId: "met_museum_nyc_2",
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
    googlePlaceId: "brooklyn_bridge_nyc_2",
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
    googlePlaceId: "amnh_nyc_2",
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
    googlePlaceId: "rockefeller_center_nyc_2",
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
    googlePlaceId: "high_line_nyc_2",
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
    googlePlaceId: "broadway_nyc_2",
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
    googlePlaceId: "911_memorial_nyc_2",
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
    googlePlaceId: "one_world_trade_nyc_2",
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
    googlePlaceId: "chelsea_market_nyc_2",
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
    googlePlaceId: "bryant_park_nyc_2",
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
    googlePlaceId: "msg_nyc_2",
    isActive: true
  }
];

async function addMoreAttractions() {
  try {
    console.log('🔍 Adding more NYC attractions to database...');
    
    let addedCount = 0;
    for (const attractionData of additionalAttractions) {
      const [attraction, created] = await Attraction.findOrCreate({
        where: { googlePlaceId: attractionData.googlePlaceId },
        defaults: attractionData
      });
      
      if (created) {
        console.log(`✅ Added: ${attraction.name}`);
        addedCount++;
      } else {
        console.log(`⏭️ Skipped (already exists): ${attraction.name}`);
      }
    }
    
    console.log(`🎉 Added ${addedCount} new attractions!`);
    
    // Count total attractions
    const count = await Attraction.count();
    console.log(`📊 Total attractions in database: ${count}`);
    
  } catch (error) {
    console.error('❌ Error adding attractions:', error);
  } finally {
    process.exit(0);
  }
}

addMoreAttractions();
