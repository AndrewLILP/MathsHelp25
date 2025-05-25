const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// New subject data
const realWorldSubject = {
  name: 'Real World Problems',
  description: 'Apply mathematics to solve authentic, real-world problems across various contexts. Connect mathematical concepts to everyday situations, careers, and global challenges.',
  iconType: 'applied-maths',
  colorTheme: '#20c997', // Teal color
  category: 'Secondary',
  displayOrder: 6
};

// Year groups for Real World Problems
const realWorldYearGroups = [
  {
    yearLevel: 7,
    name: 'Year 7 Real World Problems',
    ageRange: { min: 12, max: 13 },
    description: 'Apply basic mathematical concepts to everyday situations and simple real-world problems.'
  },
  {
    yearLevel: 8,
    name: 'Year 8 Real World Problems',
    ageRange: { min: 13, max: 14 },
    description: 'Use mathematical reasoning to solve problems involving money, measurement, and data in real contexts.'
  },
  {
    yearLevel: 9,
    name: 'Year 9 Real World Problems',
    ageRange: { min: 14, max: 15 },
    description: 'Apply algebraic and geometric thinking to solve complex real-world challenges.'
  },
  {
    yearLevel: 10,
    name: 'Year 10 Real World Problems',
    ageRange: { min: 15, max: 16 },
    description: 'Integrate multiple mathematical concepts to solve authentic, complex real-world problems.'
  },
  {
    yearLevel: 11,
    name: 'Year 11 Real World Problems',
    ageRange: { min: 16, max: 17 },
    description: 'Apply advanced mathematical modeling to real-world scenarios and career-related problems.'
  },
  {
    yearLevel: 12,
    name: 'Year 12 Real World Problems',
    ageRange: { min: 17, max: 18 },
    description: 'Solve complex, multi-step real-world problems using advanced mathematical techniques.'
  }
];

// Topics for Real World Problems by year level
const realWorldTopics = {
  'Year 7 Real World Problems': [
    {
      name: 'Budgeting and Personal Finance',
      description: 'Learn to create budgets, calculate costs, and make financial decisions using percentages, fractions, and basic arithmetic.',
      difficulty: 'Foundation',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Create a personal budget using income and expenses',
        'Calculate percentage discounts and markups',
        'Compare costs and make financial decisions',
        'Understand concepts of profit, loss, and savings'
      ],
      estimatedDuration: 60,
      keywords: ['budgeting', 'money', 'percentages', 'personal finance', 'costs', 'savings']
    },
    {
      name: 'Sports Statistics and Data',
      description: 'Analyze sports data using mean, median, mode, and create graphs to represent team and player performance.',
      difficulty: 'Developing',
      strand: 'Statistics and Probability',
      learningObjectives: [
        'Calculate and interpret sports averages',
        'Create graphs to display sports data',
        'Compare player and team statistics',
        'Make predictions based on data trends'
      ],
      estimatedDuration: 75,
      keywords: ['sports', 'statistics', 'data analysis', 'graphs', 'averages', 'performance']
    }
  ],
  'Year 8 Real World Problems': [
    {
      name: 'Planning a School Event',
      description: 'Use mathematical skills to plan a school event including budgeting, scheduling, capacity planning, and resource allocation.',
      difficulty: 'Developing',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Calculate total costs and create event budgets',
        'Determine venue capacity and seating arrangements',
        'Plan timelines and schedules using time calculations',
        'Calculate catering quantities for different group sizes'
      ],
      estimatedDuration: 90,
      keywords: ['event planning', 'budgeting', 'capacity', 'scheduling', 'resource allocation']
    },
    {
      name: 'Environmental Data Analysis',
      description: 'Analyze environmental data such as rainfall, temperature, and pollution levels to understand climate patterns and environmental issues.',
      difficulty: 'Proficient',
      strand: 'Statistics and Probability',
      learningObjectives: [
        'Interpret weather and climate data',
        'Create graphs showing environmental trends',
        'Calculate carbon footprints and environmental impact',
        'Make predictions about environmental changes'
      ],
      estimatedDuration: 80,
      keywords: ['environment', 'climate', 'data analysis', 'sustainability', 'carbon footprint']
    }
  ],
  'Year 9 Real World Problems': [
    {
      name: 'Architecture and Design',
      description: 'Apply geometric concepts and scale drawings to architectural design, including floor plans, elevations, and construction calculations.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Create scale drawings and floor plans',
        'Calculate areas and volumes for construction',
        'Use trigonometry in design problems',
        'Apply geometric principles to structural design'
      ],
      estimatedDuration: 100,
      keywords: ['architecture', 'design', 'scale drawings', 'construction', 'geometry', 'trigonometry']
    },
    {
      name: 'Small Business Mathematics',
      description: 'Explore the mathematics involved in running a small business including profit/loss, break-even analysis, and growth projections.',
      difficulty: 'Advanced',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Calculate profit, loss, and break-even points',
        'Create business projections using linear functions',
        'Analyze cash flow and financial statements',
        'Compare different pricing strategies'
      ],
      estimatedDuration: 85,
      keywords: ['business', 'profit', 'break-even', 'projections', 'cash flow', 'pricing']
    }
  ],
  'Year 10 Real World Problems': [
    {
      name: 'Medical and Health Mathematics',
      description: 'Apply mathematical concepts to health and medical situations including dosage calculations, health statistics, and epidemiological data.',
      difficulty: 'Advanced',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Calculate medication dosages based on body weight',
        'Interpret health statistics and medical data',
        'Analyze epidemiological trends and infection rates',
        'Use exponential functions to model disease spread'
      ],
      estimatedDuration: 75,
      keywords: ['medical', 'health', 'dosage', 'statistics', 'epidemiology', 'exponential growth']
    }
  ]
};

// Sample activities for Real World Problems
const realWorldActivities = [
  {
    topicName: 'Budgeting and Personal Finance',
    activity: {
      title: 'Create Your First Budget Challenge',
      description: 'Students receive a realistic teenage income scenario and must create a monthly budget including wants vs needs, savings goals, and unexpected expenses.',
      activityType: 'Real-world Application',
      resources: [
        {
          title: 'Budget Planning Template',
          url: 'https://example.com/budget-template.pdf',
          type: 'PDF',
          description: 'Printable budget planning worksheet'
        },
        {
          title: 'Online Budget Calculator',
          url: 'https://example.com/budget-calculator',
          type: 'Interactive',
          description: 'Interactive tool for budget planning'
        }
      ],
      source: 'Internal',
      difficulty: 'Foundation',
      estimatedDuration: 50,
      classSize: { min: 1, max: 30 },
      materialsNeeded: ['Calculators', 'Budget templates', 'Scenario cards'],
      learningOutcomes: [
        'Students can create a realistic monthly budget',
        'Students understand the difference between wants and needs',
        'Students can calculate savings and spending ratios'
      ],
      keywords: ['budgeting', 'personal finance', 'money management', 'real-world', 'percentages']
    }
  },
  {
    topicName: 'Planning a School Event',
    activity: {
      title: 'School Dance Planning Project',
      description: 'Teams plan every aspect of a school dance including venue, catering, entertainment, decorations, and budget within given constraints.',
      activityType: 'Real-world Application',
      resources: [
        {
          title: 'Event Planning Checklist',
          url: 'https://example.com/event-checklist.pdf',
          type: 'PDF',
          description: 'Comprehensive planning checklist'
        }
      ],
      source: 'Internal',
      difficulty: 'Developing',
      estimatedDuration: 120,
      classSize: { min: 3, max: 25 },
      materialsNeeded: ['Event planning templates', 'Calculators', 'Price lists', 'Venue layouts'],
      learningOutcomes: [
        'Students can create comprehensive event budgets',
        'Students understand capacity and space planning',
        'Students can coordinate multiple mathematical calculations'
      ],
      keywords: ['event planning', 'project management', 'budgeting', 'teamwork', 'real-world']
    }
  }
];

async function addRealWorldSubject() {
  try {
    console.log('🌍 Adding Real World Problems subject...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: realWorldSubject.name });
    if (existingSubject) {
      console.log('⚠️  Real World Problems subject already exists!');
      return;
    }

    // Create the subject
    console.log('📚 Creating subject...');
    const subject = new Subject(realWorldSubject);
    await subject.save();
    console.log(`✅ Created subject: ${subject.name}`);

    // Create year groups
    console.log('\n🎓 Creating year groups...');
    const createdYearGroups = {};
    for (const ygData of realWorldYearGroups) {
      const yearGroup = new YearGroup({
        ...ygData,
        subject: subject._id,
        curriculum: 'Australian Curriculum',
        displayOrder: ygData.yearLevel
      });
      await yearGroup.save();
      createdYearGroups[ygData.name] = yearGroup;
      console.log(`  ✅ Created year group: ${ygData.name}`);
    }

    // Create topics
    console.log('\n📖 Creating topics...');
    let totalTopics = 0;
    const createdTopics = [];
    for (const [yearGroupName, topics] of Object.entries(realWorldTopics)) {
      const yearGroup = createdYearGroups[yearGroupName];
      if (yearGroup) {
        for (let i = 0; i < topics.length; i++) {
          const topicData = topics[i];
          const topic = new Topic({
            ...topicData,
            yearGroup: yearGroup._id,
            displayOrder: i + 1
          });
          await topic.save();
          createdTopics.push(topic);
          totalTopics++;
          console.log(`  ✅ Created topic: ${topic.name}`);
        }
      }
    }

    // Create sample activities
    console.log('\n🎯 Creating sample activities...');
    let totalActivities = 0;
    for (const activityData of realWorldActivities) {
      const topic = createdTopics.find(t => t.name === activityData.topicName);
      if (topic) {
        const activity = new Activity({
          ...activityData.activity,
          topic: topic._id,
          createdBy: new mongoose.Types.ObjectId(), // Placeholder
          status: 'Published'
        });
        await activity.save();
        totalActivities++;
        console.log(`    🎯 Added activity: ${activity.title}`);
      }
    }

    // Update subject statistics
    await Subject.findByIdAndUpdate(subject._id, {
      totalTopics: totalTopics,
      totalActivities: totalActivities
    });

    console.log('\n🎉 Real World Problems subject added successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Subject: ${subject.name}`);
    console.log(`   Year Groups: ${Object.keys(createdYearGroups).length}`);
    console.log(`   Topics: ${totalTopics}`);
    console.log(`   Activities: ${totalActivities}`);

  } catch (error) {
    console.error('❌ Error adding Real World Problems subject:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  addRealWorldSubject();
}

module.exports = addRealWorldSubject;