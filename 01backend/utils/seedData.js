const mongoose = require('mongoose');
require('dotenv').config();

// Import models with simple relative paths
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// Sample data for Mathematics subjects
const mathsSubjects = [
  {
    name: 'Primary Mathematics',
    description: 'Foundation mathematics for primary school students covering basic number operations, simple geometry, and data collection.',
    iconType: 'calculator',
    colorTheme: '#28a745',
    category: 'Primary',
    displayOrder: 1
  },
  {
    name: 'Algebra',
    description: 'Study of mathematical symbols and rules for manipulating these symbols. Covers equations, functions, and abstract mathematical concepts.',
    iconType: 'algebra',
    colorTheme: '#6f42c1',
    category: 'Secondary',
    displayOrder: 2
  },
  {
    name: 'Geometry',
    description: 'Study of shapes, sizes, positions, angles, and dimensions. Includes both 2D and 3D geometric concepts.',
    iconType: 'geometry',
    colorTheme: '#fd7e14',
    category: 'Secondary',
    displayOrder: 3
  },
  {
    name: 'Statistics & Probability',
    description: 'Collection, analysis, interpretation, and presentation of data. Understanding of probability and statistical inference.',
    iconType: 'statistics',
    colorTheme: '#20c997',
    category: 'Secondary',
    displayOrder: 4
  },
  {
    name: 'Calculus',
    description: 'Advanced mathematics dealing with continuous change. Covers differentiation, integration, and applications.',
    iconType: 'calculus',
    colorTheme: '#dc3545',
    category: 'Advanced',
    displayOrder: 5
  }
];

// Year groups for each subject
const yearGroupsData = {
  'Primary Mathematics': [
    { yearLevel: 1, ageRange: { min: 6, max: 7 }, name: 'Year 1 Mathematics' },
    { yearLevel: 2, ageRange: { min: 7, max: 8 }, name: 'Year 2 Mathematics' },
    { yearLevel: 3, ageRange: { min: 8, max: 9 }, name: 'Year 3 Mathematics' },
    { yearLevel: 4, ageRange: { min: 9, max: 10 }, name: 'Year 4 Mathematics' },
    { yearLevel: 5, ageRange: { min: 10, max: 11 }, name: 'Year 5 Mathematics' },
    { yearLevel: 6, ageRange: { min: 11, max: 12 }, name: 'Year 6 Mathematics' }
  ],
  'Algebra': [
    { yearLevel: 7, ageRange: { min: 12, max: 13 }, name: 'Year 7 Algebra' },
    { yearLevel: 8, ageRange: { min: 13, max: 14 }, name: 'Year 8 Algebra' },
    { yearLevel: 9, ageRange: { min: 14, max: 15 }, name: 'Year 9 Algebra' },
    { yearLevel: 10, ageRange: { min: 15, max: 16 }, name: 'Year 10 Algebra' }
  ],
  'Geometry': [
    { yearLevel: 7, ageRange: { min: 12, max: 13 }, name: 'Year 7 Geometry' },
    { yearLevel: 8, ageRange: { min: 13, max: 14 }, name: 'Year 8 Geometry' },
    { yearLevel: 9, ageRange: { min: 14, max: 15 }, name: 'Year 9 Geometry' },
    { yearLevel: 10, ageRange: { min: 15, max: 16 }, name: 'Year 10 Geometry' }
  ],
  'Statistics & Probability': [
    { yearLevel: 8, ageRange: { min: 13, max: 14 }, name: 'Year 8 Statistics' },
    { yearLevel: 9, ageRange: { min: 14, max: 15 }, name: 'Year 9 Statistics' },
    { yearLevel: 10, ageRange: { min: 15, max: 16 }, name: 'Year 10 Statistics' },
    { yearLevel: 11, ageRange: { min: 16, max: 17 }, name: 'Year 11 Statistics' }
  ],
  'Calculus': [
    { yearLevel: 11, ageRange: { min: 16, max: 17 }, name: 'Year 11 Calculus' },
    { yearLevel: 12, ageRange: { min: 17, max: 18 }, name: 'Year 12 Calculus' }
  ]
};

// Sample topics for different subjects
const topicsData = {
  'Primary Mathematics': {
    'Year 1 Mathematics': [
      {
        name: 'Counting and Number Recognition',
        description: 'Learning to count objects, recognize numbers 1-20, and understand quantity.',
        difficulty: 'Foundation',
        strand: 'Number and Algebra',
        learningObjectives: ['Count to 20', 'Recognize written numbers', 'Understand more and less'],
        estimatedDuration: 45,
        keywords: ['counting', 'numbers', 'quantity', 'recognition']
      },
      {
        name: 'Basic Addition',
        description: 'Introduction to addition using concrete objects and simple number sentences.',
        difficulty: 'Foundation',
        strand: 'Number and Algebra',
        learningObjectives: ['Add numbers to 10', 'Use concrete materials', 'Write addition sentences'],
        estimatedDuration: 60,
        keywords: ['addition', 'plus', 'sum', 'combine']
      }
    ],
    'Year 3 Mathematics': [
      {
        name: 'Multiplication Tables',
        description: 'Learning multiplication facts for 2, 5, and 10 times tables.',
        difficulty: 'Developing',
        strand: 'Number and Algebra',
        learningObjectives: ['Recall 2x table', 'Recall 5x table', 'Recall 10x table', 'Identify patterns'],
        estimatedDuration: 45,
        keywords: ['multiplication', 'times tables', 'patterns', 'facts']
      }
    ]
  },
  'Algebra': {
    'Year 7 Algebra': [
      {
        name: 'Introduction to Variables',
        description: 'Understanding what variables represent and how to use them in simple expressions.',
        difficulty: 'Foundation',
        strand: 'Number and Algebra',
        learningObjectives: ['Define variables', 'Write expressions', 'Substitute values'],
        estimatedDuration: 60,
        keywords: ['variables', 'expressions', 'substitution', 'algebra']
      },
      {
        name: 'Solving Simple Equations',
        description: 'Learning to solve linear equations with one variable using balance method.',
        difficulty: 'Developing',
        strand: 'Number and Algebra',
        learningObjectives: ['Balance equations', 'Isolate variables', 'Check solutions'],
        estimatedDuration: 75,
        keywords: ['equations', 'solving', 'balance', 'linear']
      }
    ]
  },
  'Geometry': {
    'Year 8 Geometry': [
      {
        name: 'Properties of Triangles',
        description: 'Exploring different types of triangles and their properties.',
        difficulty: 'Developing',
        strand: 'Measurement and Geometry',
        learningObjectives: ['Classify triangles', 'Calculate angles', 'Understand congruence'],
        estimatedDuration: 60,
        keywords: ['triangles', 'angles', 'properties', 'classification']
      }
    ]
  }
};

// Sample activities
const activitiesData = [
  {
    title: 'Counting Bears Activity',
    description: 'Using colorful counting bears to practice number recognition and basic counting skills.',
    activityType: 'Hands-on Activity',
    resources: [
      {
        title: 'Counting Bears Worksheet',
        url: 'https://example.com/counting-bears.pdf',
        type: 'PDF',
        description: 'Printable worksheet with counting exercises'
      }
    ],
    source: 'Internal',
    difficulty: 'Foundation',
    estimatedDuration: 30,
    materialsNeeded: ['Counting bears', 'Worksheet', 'Pencils'],
    learningOutcomes: ['Students can count objects to 20', 'Students recognize number symbols'],
    keywords: ['counting', 'manipulatives', 'hands-on', 'bears']
  },
  {
    title: 'Times Tables Rap',
    description: 'Musical approach to learning multiplication tables through rhythm and rhyme.',
    activityType: 'Interactive Game',
    resources: [
      {
        title: 'Times Tables Song',
        url: 'https://example.com/times-tables-rap',
        type: 'Video',
        description: 'Educational rap video for 2x table'
      }
    ],
    source: 'External',
    difficulty: 'Developing',
    estimatedDuration: 20,
    materialsNeeded: ['Audio device', 'Lyrics sheet'],
    learningOutcomes: ['Students memorize 2x table', 'Students enjoy learning mathematics'],
    keywords: ['multiplication', 'music', 'memorization', 'fun']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Activity.deleteMany({});
    await Topic.deleteMany({});
    await YearGroup.deleteMany({});
    await Subject.deleteMany({});

    // Create subjects
    console.log('📚 Creating subjects...');
    const createdSubjects = {};
    for (const subjectData of mathsSubjects) {
      const subject = new Subject(subjectData);
      await subject.save();
      createdSubjects[subject.name] = subject;
      console.log(`  ✅ Created subject: ${subject.name}`);
    }

    // Create year groups
    console.log('🎓 Creating year groups...');
    const createdYearGroups = {};
    for (const [subjectName, yearGroups] of Object.entries(yearGroupsData)) {
      const subject = createdSubjects[subjectName];
      if (subject) {
        createdYearGroups[subjectName] = {};
        for (const ygData of yearGroups) {
          const yearGroup = new YearGroup({
            ...ygData,
            subject: subject._id,
            curriculum: 'Australian Curriculum',
            displayOrder: ygData.yearLevel
          });
          await yearGroup.save();
          createdYearGroups[subjectName][ygData.name] = yearGroup;
          console.log(`  ✅ Created year group: ${ygData.name}`);
        }
      }
    }

    // Create topics
    console.log('📖 Creating topics...');
    const createdTopics = [];
    for (const [subjectName, yearGroupTopics] of Object.entries(topicsData)) {
      for (const [yearGroupName, topics] of Object.entries(yearGroupTopics)) {
        const yearGroup = createdYearGroups[subjectName]?.[yearGroupName];
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
            console.log(`  ✅ Created topic: ${topic.name}`);
          }
        }
      }
    }

    // Create sample activities
    console.log('🎯 Creating sample activities...');
    if (createdTopics.length > 0) {
      for (let i = 0; i < activitiesData.length && i < createdTopics.length; i++) {
        const activityData = activitiesData[i];
        const activity = new Activity({
          ...activityData,
          topic: createdTopics[i]._id,
          createdBy: new mongoose.Types.ObjectId(), // Placeholder - will be replaced when users are created
          status: 'Published'
        });
        await activity.save();
        console.log(`  ✅ Created activity: ${activity.title}`);
      }
    }

    // Update counts
    console.log('🔢 Updating counts...');
    for (const subject of Object.values(createdSubjects)) {
      const yearGroupIds = await YearGroup.find({ subject: subject._id }).select('_id');
      const topicCount = await Topic.countDocuments({
        yearGroup: { $in: yearGroupIds }
      });
      const topicIds = await Topic.find({
        yearGroup: { $in: yearGroupIds }
      }).select('_id');
      const activityCount = await Activity.countDocuments({
        topic: { $in: topicIds }
      });

      await Subject.findByIdAndUpdate(subject._id, {
        totalTopics: topicCount,
        totalActivities: activityCount
      });
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Subjects: ${Object.keys(createdSubjects).length}`);
    console.log(`   Year Groups: ${Object.values(createdYearGroups).reduce((acc, yg) => acc + Object.keys(yg).length, 0)}`);
    console.log(`   Topics: ${createdTopics.length}`);
    console.log(`   Activities: ${activitiesData.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Full error details:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📝 Database connection closed');
    }
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;