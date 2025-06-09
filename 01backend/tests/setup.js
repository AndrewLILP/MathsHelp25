// File: 01backend/tests/setup.js
// Test setup for MathsHelp25 backend

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Setup before all tests
beforeAll(async () => {
  console.log('🧪 Setting up test database...');
  
  // Start in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(mongoUri);
  
  console.log('✅ Test database ready');
});

// Cleanup after each test
afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Cleanup after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test database...');
  
  // Close mongoose connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Stop the in-memory MongoDB instance
  await mongod.stop();
  
  console.log('✅ Test cleanup complete');
});

// Test environment variables
process.env.NODE_ENV = 'test';
process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';
process.env.AUTH0_AUDIENCE = 'test-audience';
process.env.MONGODB_URI = 'test-uri'; // Will be overridden by in-memory DB