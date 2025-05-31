// File: scripts/findTopics.js - Run this to get real topic IDs
const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const Topic = require('../models/Topic');
const YearGroup = require('../models/YearGroup');
const Subject = require('../models/Subject');

async function findTopics() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mathshelp25');
    console.log('✅ Connected to MongoDB');

    // Find all topics with populated data
    const topics = await Topic.find()
      .populate({
        path: 'yearGroup',
        populate: {
          path: 'subject',
          select: 'name'
        }
      })
      .limit(10);

    if (topics.length === 0) {
      console.log('❌ No topics found in database');
      console.log('🔧 You may need to seed your database first');
    } else {
      console.log('\n📚 Found Topics:');
      console.log('==================');
      
      topics.forEach((topic, index) => {
        console.log(`${index + 1}. Topic: "${topic.name}"`);
        console.log(`   ID: ${topic._id}`);
        console.log(`   Year: ${topic.yearGroup?.name || 'Unknown'}`);
        console.log(`   Subject: ${topic.yearGroup?.subject?.name || 'Unknown'}`);
        console.log(`   Description: ${topic.description || 'No description'}`);
        console.log('   ---');
      });

      console.log('\n🎯 Use any of these IDs in your CreateActivityPage:');
      console.log(`const selectedTopic = { _id: '${topics[0]._id}', ... }`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the function
findTopics();