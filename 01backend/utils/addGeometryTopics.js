const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// Geometry topics for different year levels
const geometryTopics = {
  'Year 7 Geometry': [
    {
      name: 'Properties of Triangles',
      description: 'Exploring different types of triangles, their properties, and classification. Students learn to identify scalene, isosceles, and equilateral triangles.',
      difficulty: 'Developing',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Classify triangles by side length (scalene, isosceles, equilateral)',
        'Classify triangles by angle type (acute, right, obtuse)',
        'Calculate interior angles of triangles',
        'Understand triangle inequality theorem'
      ],
      estimatedDuration: 60,
      keywords: ['triangles', 'classification', 'angles', 'properties', 'scalene', 'isosceles', 'equilateral']
    },
    {
      name: 'Parallel Lines and Angles',
      description: 'Understanding relationships between angles when parallel lines are cut by a transversal. Learn corresponding, alternate, and co-interior angles.',
      difficulty: 'Developing',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Identify corresponding angles',
        'Identify alternate interior and exterior angles',
        'Identify co-interior (same-side interior) angles',
        'Use angle relationships to solve problems'
      ],
      estimatedDuration: 75,
      keywords: ['parallel lines', 'transversal', 'corresponding angles', 'alternate angles', 'co-interior']
    },
    {
      name: 'Area and Perimeter of Rectangles',
      description: 'Calculate area and perimeter of rectangles and squares. Apply formulas to solve real-world problems involving rectangular shapes.',
      difficulty: 'Foundation',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Apply the formula for area of rectangles (A = l × w)',
        'Apply the formula for perimeter of rectangles (P = 2l + 2w)',
        'Solve real-world problems involving area and perimeter',
        'Compare areas of different rectangles'
      ],
      estimatedDuration: 45,
      keywords: ['area', 'perimeter', 'rectangles', 'squares', 'formulas', 'measurement']
    }
  ],
  'Year 8 Geometry': [
    {
      name: 'Circle Properties and Circumference',
      description: 'Explore the properties of circles including radius, diameter, and circumference. Learn to calculate circumference using π.',
      difficulty: 'Developing',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Understand the relationship between radius and diameter',
        'Calculate circumference using C = πd or C = 2πr',
        'Use approximations for π in calculations',
        'Solve problems involving circles in real contexts'
      ],
      estimatedDuration: 60,
      keywords: ['circles', 'radius', 'diameter', 'circumference', 'pi', 'formula']
    },
    {
      name: 'Pythagorean Theorem',
      description: 'Discover and apply the Pythagorean theorem to find missing sides in right-angled triangles. Connect geometry to number theory.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'State the Pythagorean theorem (a² + b² = c²)',
        'Identify the hypotenuse in right triangles',
        'Calculate missing sides using the theorem',
        'Apply the theorem to real-world problems'
      ],
      estimatedDuration: 90,
      keywords: ['pythagorean theorem', 'right triangles', 'hypotenuse', 'squares', 'square roots']
    },
    {
      name: 'Congruent Triangles',
      description: 'Understanding when triangles are congruent and the tests for congruence: SSS, SAS, AAS, and RHS.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Define congruent triangles',
        'Apply SSS (Side-Side-Side) test',
        'Apply SAS (Side-Angle-Side) test',
        'Apply AAS (Angle-Angle-Side) and RHS (Right-Hypotenuse-Side) tests'
      ],
      estimatedDuration: 75,
      keywords: ['congruent triangles', 'SSS', 'SAS', 'AAS', 'RHS', 'congruence tests']
    }
  ],
  'Year 9 Geometry': [
    {
      name: 'Similar Triangles and Scale Factors',
      description: 'Understanding similarity in triangles, scale factors, and applications to solving problems involving proportional reasoning.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Identify similar triangles',
        'Calculate scale factors between similar figures',
        'Use similarity to find missing lengths',
        'Apply similarity in real-world contexts'
      ],
      estimatedDuration: 80,
      keywords: ['similar triangles', 'scale factor', 'proportions', 'similarity tests', 'enlargement']
    },
    {
      name: 'Area of Triangles and Parallelograms',
      description: 'Calculate areas of triangles, parallelograms, and composite shapes. Understand the relationship between different area formulas.',
      difficulty: 'Developing',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Apply area formula for triangles (A = ½bh)',
        'Apply area formula for parallelograms (A = bh)',
        'Calculate areas of composite shapes',
        'Solve problems involving areas in context'
      ],
      estimatedDuration: 70,
      keywords: ['area', 'triangles', 'parallelograms', 'composite shapes', 'base', 'height']
    }
  ],
  'Year 10 Geometry': [
    {
      name: 'Trigonometric Ratios',
      description: 'Introduction to sine, cosine, and tangent ratios in right-angled triangles. Apply trigonometry to solve practical problems.',
      difficulty: 'Advanced',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Define sine, cosine, and tangent ratios',
        'Use SOH-CAH-TOA to remember ratios',
        'Calculate missing sides using trigonometric ratios',
        'Solve real-world problems involving trigonometry'
      ],
      estimatedDuration: 90,
      keywords: ['trigonometry', 'sine', 'cosine', 'tangent', 'SOH-CAH-TOA', 'right triangles']
    },
    {
      name: 'Volume of Prisms and Cylinders',
      description: 'Calculate volumes of rectangular and triangular prisms, and cylinders. Apply volume formulas to solve practical problems.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Apply volume formula for rectangular prisms (V = lwh)',
        'Apply volume formula for triangular prisms (V = ½bhl)',
        'Apply volume formula for cylinders (V = πr²h)',
        'Solve problems involving volume in real contexts'
      ],
      estimatedDuration: 75,
      keywords: ['volume', 'prisms', 'cylinders', 'rectangular prism', 'triangular prism', 'formula']
    },
    {
      name: 'Test**************************',
      description: 'Calculate volumes of rectangular and triangular prisms, and cylinders. Apply volume formulas to solve practical problems.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Apply volume formula for rectangular prisms (V = lwh)',
        'Apply volume formula for triangular prisms (V = ½bhl)',
        'Apply volume formula for cylinders (V = πr²h)',
        'Solve problems involving volume in real contexts'
      ],
      estimatedDuration: 75,
      keywords: ['volume', 'prisms', 'cylinders', 'rectangular prism', 'triangular prism', 'formula']
    },
  ]
};

// Sample activities for some geometry topics
const geometryActivities = [
  {
    topicName: 'Properties of Triangles',
    activity: {
      title: 'Triangle Classification Sorting Activity',
      description: 'Students sort triangle cutouts into categories based on side lengths and angle types. Hands-on activity that reinforces triangle properties through physical manipulation.',
      activityType: 'Hands-on Activity',
      resources: [
        {
          title: 'Triangle Sorting Worksheet',
          url: 'https://example.com/triangle-sorting.pdf',
          type: 'PDF',
          description: 'Printable triangle cutouts for classification activity'
        },
        {
          title: 'Triangle Properties Reference Sheet',
          url: 'https://example.com/triangle-properties.pdf',
          type: 'PDF',
          description: 'Quick reference guide for triangle types'
        }
      ],
      source: 'Internal',
      difficulty: 'Developing',
      estimatedDuration: 40,
      classSize: { min: 2, max: 30 },
      materialsNeeded: ['Triangle cutouts', 'Sorting trays', 'Rulers', 'Protractors'],
      learningOutcomes: [
        'Students can classify triangles by side length',
        'Students can classify triangles by angle type',
        'Students understand triangle naming conventions'
      ],
      keywords: ['triangles', 'classification', 'sorting', 'hands-on', 'properties']
    }
  },
  {
    topicName: 'Pythagorean Theorem',
    activity: {
      title: 'Pythagorean Theorem Discovery Lab',
      description: 'Students discover the Pythagorean theorem through hands-on exploration using square tiles and grid paper. Build understanding before introducing the formula.',
      activityType: 'Hands-on Activity',
      resources: [
        {
          title: 'Pythagorean Discovery Worksheet',
          url: 'https://example.com/pythagorean-discovery.pdf',
          type: 'PDF',
          description: 'Guided worksheet for theorem discovery'
        },
        {
          title: 'Interactive Pythagorean Tool',
          url: 'https://www.geogebra.org/m/VXMQKXAb',
          type: 'Interactive',
          description: 'GeoGebra applet for visualizing the theorem'
        }
      ],
      source: 'Internal',
      difficulty: 'Proficient',
      estimatedDuration: 60,
      classSize: { min: 2, max: 24 },
      materialsNeeded: ['Square tiles', 'Grid paper', 'Rulers', 'Calculators'],
      learningOutcomes: [
        'Students discover the relationship a² + b² = c²',
        'Students can identify the hypotenuse',
        'Students understand why the theorem works'
      ],
      keywords: ['pythagorean', 'discovery', 'squares', 'right triangles', 'investigation']
    }
  },
  {
    topicName: 'Circle Properties and Circumference',
    activity: {
      title: 'Discovering Pi Through Measurement',
      description: 'Students measure various circular objects to discover the relationship between diameter and circumference, leading to an understanding of π.',
      activityType: 'Hands-on Activity',
      resources: [
        {
          title: 'Pi Discovery Data Sheet',
          url: 'https://example.com/pi-discovery.pdf',
          type: 'PDF',
          description: 'Data collection sheet for measuring circles'
        }
      ],
      source: 'Internal',
      difficulty: 'Developing',
      estimatedDuration: 50,
      classSize: { min: 2, max: 30 },
      materialsNeeded: ['Various circular objects', 'String or tape measures', 'Rulers', 'Calculators'],
      learningOutcomes: [
        'Students discover that C/d ≈ 3.14 for all circles',
        'Students understand what π represents',
        'Students can calculate circumference using the formula'
      ],
      keywords: ['circles', 'pi', 'circumference', 'diameter', 'measurement', 'discovery']
    }
  }
];

async function addGeometryTopics() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the Geometry subject
    const geometrySubject = await Subject.findOne({ name: 'Geometry' });
    if (!geometrySubject) {
      console.log('❌ Geometry subject not found');
      return;
    }
    console.log('📐 Found Geometry subject');

    let totalTopicsAdded = 0;
    let totalActivitiesAdded = 0;

    // Add topics for each year group
    for (const [yearGroupName, topics] of Object.entries(geometryTopics)) {
      console.log(`\n📚 Processing ${yearGroupName}...`);
      
      // Find the year group
      const yearGroup = await YearGroup.findOne({ 
        name: yearGroupName,
        subject: geometrySubject._id 
      });
      
      if (!yearGroup) {
        console.log(`⚠️  Year group ${yearGroupName} not found, skipping...`);
        continue;
      }

      // Add topics for this year group
      for (let i = 0; i < topics.length; i++) {
        const topicData = topics[i];
        
        // Check if topic already exists
        const existingTopic = await Topic.findOne({
          name: topicData.name,
          yearGroup: yearGroup._id
        });

        if (existingTopic) {
          console.log(`  ⏭️  Topic "${topicData.name}" already exists, skipping...`);
          continue;
        }

        // Create the topic
        const topic = new Topic({
          ...topicData,
          yearGroup: yearGroup._id,
          displayOrder: i + 1
        });

        await topic.save();
        totalTopicsAdded++;
        console.log(`  ✅ Added topic: ${topic.name}`);

        // Add activity if available
        const activityData = geometryActivities.find(a => a.topicName === topicData.name);
        if (activityData) {
          const activity = new Activity({
            ...activityData.activity,
            topic: topic._id,
            createdBy: new mongoose.Types.ObjectId(), // Placeholder
            status: 'Published'
          });
          
          await activity.save();
          totalActivitiesAdded++;
          console.log(`    🎯 Added activity: ${activity.title}`);
        }
      }
    }

    // Update geometry subject statistics
    console.log('\n🔢 Updating subject statistics...');
    const geometryYearGroupsList = await YearGroup.find({ subject: geometrySubject._id });
    const geometryTopicsList = await Topic.find({
      yearGroup: { $in: geometryYearGroupsList.map(yg => yg._id) }
    });
    const geometryActivitiesList = await Activity.find({
      topic: { $in: geometryTopicsList.map(t => t._id) }
    });

    await Subject.findByIdAndUpdate(geometrySubject._id, {
      totalTopics: geometryTopicsList.length,
      totalActivities: geometryActivitiesList.length
    });

    console.log('\n🎉 Geometry content added successfully!');
    console.log(`📊 Summary:`);
    console.log(`   New Topics Added: ${totalTopicsAdded}`);
    console.log(`   New Activities Added: ${totalActivitiesAdded}`);
    console.log(`   Total Geometry Topics: ${geometryTopicsList.length}`);
    console.log(`   Total Geometry Activities: ${geometryActivitiesList.length}`);

  } catch (error) {
    console.error('❌ Error adding geometry topics:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  addGeometryTopics();
}

module.exports = addGeometryTopics;