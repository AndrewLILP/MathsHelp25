// 01backend/scripts/productionSeed.js
require('dotenv').config();
const mongoose = require('mongoose');

async function seedProduction() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('❌ This script only runs in production');
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if data already exists
    const Subject = require('../models/Subject');
    const existingData = await Subject.countDocuments();
    
    if (existingData > 0) {
      console.log('✅ Database already seeded');
      return;
    }
    
    // Run seeding scripts
    await require('../utils/seedData')();
    console.log('✅ Production database seeded');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

if (require.main === module) {
  seedProduction();
}