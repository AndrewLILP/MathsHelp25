// utils/addFinancialGameActivity.js
require('dotenv').config();
const mongoose = require('mongoose');

// Import models - adjust these paths to match your project structure
const User = require('../models/User');
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

console.log('🎮 Adding Financial Freedom Game activity...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    try {
      // Find or create Real World Problems subject (based on your latest dev log)
      let rwpSubject = await Subject.findOne({ name: 'Real World Problems' });
      if (!rwpSubject) {
        rwpSubject = await Subject.create({
          name: 'Real World Problems',
          description: 'Applied mathematics in real-world contexts',
          category: 'Secondary',
          color: '#20c997',
          iconType: 'chart-line' // Adjust based on your icon system
        });
        console.log('📊 Created Real World Problems subject');
      }

      // Find or create Year 10 year group
      let year10 = await YearGroup.findOne({ 
        name: 'Year 10', 
        subject: rwpSubject._id 
      });
      
      if (!year10) {
        year10 = await YearGroup.create({
          name: 'Year 10',
          subject: rwpSubject._id
        });
        console.log('📚 Created Year 10 year group');
      }

      // Find or create Financial Mathematics topic
      let financialTopic = await Topic.findOne({ 
        name: 'Financial Mathematics',
        yearGroup: year10._id
      });
      
      if (!financialTopic) {
        financialTopic = await Topic.create({
          name: 'Financial Mathematics',
          description: 'Understanding money, investments, and financial planning',
          yearGroup: year10._id,
          difficulty: 'Proficient', // Using your difficulty naming convention
          learningObjectives: [
            'Understand compound interest and its applications',
            'Calculate loan repayments and investment growth',
            'Create and analyze personal budgets',
            'Compare financial products and make informed decisions'
          ]
        });
        console.log('💰 Created Financial Mathematics topic');
      }

      // Get current user or create a system user if needed
      // Adjust this based on your auth strategy - you're using Auth0
      let systemUser = await User.findOne({ email: 'system@mathshelp25.app' });
      if (!systemUser) {
        systemUser = await User.create({
          name: 'MathsHelp25 System',
          email: 'system@mathshelp25.app',
          role: 'admin'
        });
        console.log('👤 Created system user');
      }

      // Create the Financial Freedom Game activity
      const financialGame = await Activity.create({
        title: 'Financial Freedom Game',
        description: 'An interactive board game that teaches students about income, expenses, investments, and financial decision-making. Students navigate life events while managing their finances to reach financial freedom.',
        activityType: 'Hands-on Activity',
        difficulty: 'Developing',
        duration: 60, // minutes
        classSize: { min: 2, max: 30 },
        materials: [
          'Financial Freedom game boards',
          'Play money',
          'Financial decision cards',
          'Investment tracker sheets',
          'Calculators'
        ],
        learningOutcomes: [
          'Students can explain basic financial concepts',
          'Students can make informed financial decisions',
          'Students can calculate compound interest',
          'Students understand risk and reward in investments'
        ],
        resources: [
          {
            type: 'website',
            name: 'Online Financial Calculator',
            url: 'https://mathshelp25.app/resources/financial-calculator'
          },
          {
            type: 'PDF',
            name: 'Game Instructions',
            url: 'https://mathshelp25.app/resources/financial-freedom-instructions.pdf'
          }
        ],
        topic: financialTopic._id,
        createdBy: systemUser._id,
        averageRating: 0,
        ratingCount: 0
      });

      console.log('✅ Successfully added Financial Freedom Game activity!');
      
      // Update topic if you're tracking activity count
      if (financialTopic.activityCount !== undefined) {
        await Topic.findByIdAndUpdate(
          financialTopic._id, 
          { $inc: { activityCount: 1 } }
        );
      }
      
    } catch (error) {
      console.log('❌ Error adding Financial Freedom Game activity:', error);
    } finally {
      await mongoose.connection.close();
      console.log('📝 Database connection closed');
    }
  })
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
  });