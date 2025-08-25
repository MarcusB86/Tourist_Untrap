const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📊 Environment:', process.env.NODE_ENV);
  console.log('🗄️ DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  
  let sequelize;
  
  if (process.env.DATABASE_URL) {
    console.log('🚀 Using DATABASE_URL for connection...');
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  } else {
    console.log('🏠 Using local database configuration...');
    sequelize = new Sequelize(
      process.env.DB_NAME || 'tourist_untrap',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'password',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: console.log
      }
    );
  }
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log('⏰ Current database time:', results[0].current_time);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔍 Error details:', {
      name: error.name,
      code: error.code,
      errno: error.errno
    });
  } finally {
    await sequelize.close();
    console.log('🔒 Connection closed.');
  }
}

testConnection();
