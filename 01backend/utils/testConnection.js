const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('💡 Make sure your .env file exists in the 01backend folder with:');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathshelp25');
      return;
    }
    
    // Connect to MongoDB (removed deprecated options)
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🏠 Host:', mongoose.connection.host);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'Connection successful!' });
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your MongoDB username and password');
    } else if (error.message.includes('network')) {
      console.log('💡 Check your internet connection and MongoDB Atlas whitelist');
    }
  } finally {
    await mongoose.connection.close();
    console.log('📝 Connection closed');
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = testConnection;