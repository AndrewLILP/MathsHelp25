// File: 01backend/utils/testActivityCreation.js
// Test script to create an activity with resource links

const mongoose = require('mongoose');
require('dotenv').config();

const Activity = require('../models/Activity');
const Topic = require('../models/Topic');
const User = require('../models/User');

async function testActivityCreation() {
  try {
    console.log('🧪 Testing Activity Creation with Resource Links...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find a topic to attach the activity to
    const topic = await Topic.findOne().populate('yearGroup');
    if (!topic) {
      console.log('❌ No topics found. Run seed script first.');
      return;
    }
    console.log(`📖 Using topic: ${topic.name}`);

    // Create a test user if needed
    let testUser = await User.findOne({ email: 'test@mathshelp25.com' });
    if (!testUser) {
      testUser = new User({
        auth0Id: 'test-user-123',
        name: 'Test Teacher',
        email: 'test@mathshelp25.com',
        role: 'teacher'
      });
      await testUser.save();
      console.log('👤 Created test user');
    }

    // Create test activity with multiple resource types
    const testActivity = new Activity({
      title: 'Resource Links Test Activity',
      description: 'This activity tests that resource links work correctly in the frontend. Students should be able to click on all resource links.',
      topic: topic._id,
      createdBy: testUser._id,
      activityType: 'Digital Tool',
      difficulty: 'Developing',
      estimatedDuration: 45,
      classSize: { min: 1, max: 30 },
      materialsNeeded: [
        'Computer or tablet',
        'Internet connection',
        'Web browser'
      ],
      learningOutcomes: [
        'Students can access online mathematical tools',
        'Students can navigate educational websites',
        'Students understand digital resource types'
      ],
      keywords: ['digital', 'online', 'resources', 'links', 'testing'],
      resources: [
        {
          title: 'Desmos Graphing Calculator',
          url: 'https://www.desmos.com/calculator',
          type: 'Interactive',
          description: 'Free online graphing calculator for exploring functions'
        },
        {
          title: 'Khan Academy - Quadratic Functions',
          url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations',
          type: 'Website',
          description: 'Video tutorials and practice exercises'
        },
        {
          title: 'GeoGebra Interactive Math',
          url: 'https://www.geogebra.org/',
          type: 'Interactive',
          description: 'Dynamic mathematics software for learning and teaching'
        },
        {
          title: 'Sample PDF Worksheet',
          url: 'https://www.mathworksheets4kids.com/quadratic-function.pdf',
          type: 'PDF',
          description: 'Printable worksheet for practice problems'
        },
        {
          title: 'Math Explained Video',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          type: 'Video',
          description: 'Educational video explaining the concept'
        }
      ],
      status: 'Published'
    });

    await testActivity.save();
    
    console.log('✅ Test activity created successfully!');
    console.log(`🆔 Activity ID: ${testActivity._id}`);
    console.log(`📊 Resource count: ${testActivity.resources.length}`);
    
    // Verify the resources were saved correctly
    console.log('\n📋 Saved Resources:');
    testActivity.resources.forEach((resource, index) => {
      console.log(`  ${index + 1}. ${resource.title}`);
      console.log(`     URL: ${resource.url}`);
      console.log(`     Type: ${resource.type}`);
      console.log(`     Description: ${resource.description}`);
      console.log('');
    });

    console.log('\n🧪 Test Instructions:');
    console.log('1. Start your frontend application');
    console.log('2. Navigate to an activities page');
    console.log('3. Find the "Resource Links Test Activity"');
    console.log('4. Click on the resource dropdown/button');
    console.log('5. Try clicking each resource link');
    console.log('6. Verify that links open in new tabs');
    console.log(`7. Or go directly to: http://localhost:3000/activities/${testActivity._id}`);

  } catch (error) {
    console.error('❌ Error creating test activity:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  testActivityCreation();
}

module.exports = testActivityCreation;