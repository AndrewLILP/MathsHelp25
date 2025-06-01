const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Subject = require('../models/Subject');
const YearGroup = require('../models/YearGroup');
const Topic = require('../models/Topic');
const Activity = require('../models/Activity');

// New subject data
const geogebraSubject = {
  name: 'Interactive Mathematics',
  description: 'Explore mathematical concepts through dynamic, interactive visualizations using GeoGebra applets. Build understanding through hands-on manipulation of geometric constructions, algebraic functions, and statistical data.',
  iconType: 'geometry', // Valid enum value - fits GeoGebra's visual/geometric nature
  colorTheme: '#007BFF', // Blue color
  category: 'Secondary',
  displayOrder: 7
};

// Year groups for Interactive Mathematics
const geogebraYearGroups = [
  {
    yearLevel: 7,
    name: 'Year 7 Interactive Mathematics',
    ageRange: { min: 12, max: 13 },
    description: 'Explore basic geometric shapes, number patterns, and simple functions through interactive visualizations.'
  },
  {
    yearLevel: 8,
    name: 'Year 8 Interactive Mathematics',
    ageRange: { min: 13, max: 14 },
    description: 'Investigate linear relationships, coordinate geometry, and probability through dynamic mathematical tools.'
  },
  {
    yearLevel: 9,
    name: 'Year 9 Interactive Mathematics',
    ageRange: { min: 14, max: 15 },
    description: 'Analyze quadratic functions, trigonometry, and geometric transformations using interactive applets.'
  },
  {
    yearLevel: 10,
    name: 'Year 10 Interactive Mathematics',
    ageRange: { min: 15, max: 16 },
    description: 'Explore advanced functions, calculus concepts, and statistical analysis through interactive modeling.'
  },
  {
    yearLevel: 11,
    name: 'Year 11 Interactive Mathematics',
    ageRange: { min: 16, max: 17 },
    description: 'Investigate complex functions, differential calculus, and advanced statistical concepts interactively.'
  },
  {
    yearLevel: 12,
    name: 'Year 12 Interactive Mathematics',
    ageRange: { min: 17, max: 18 },
    description: 'Master advanced calculus, mathematical modeling, and complex problem-solving through dynamic visualizations.'
  }
];

// Topics for Interactive Mathematics by year level
const geogebraTopics = {
  'Year 7 Interactive Mathematics': [
    {
      name: 'Basic Geometric Constructions',
      description: 'Learn fundamental geometric constructions using interactive tools. Explore points, lines, angles, and basic shapes through hands-on manipulation.',
      difficulty: 'Foundation',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Construct basic geometric shapes using interactive tools',
        'Understand properties of lines, angles, and polygons',
        'Explore symmetry and transformations through manipulation',
        'Measure lengths, angles, and areas dynamically'
      ],
      estimatedDuration: 60,
      keywords: ['geometry', 'construction', 'shapes', 'angles', 'symmetry', 'interactive']
    },
    {
      name: 'Number Patterns and Sequences',
      description: 'Visualize number patterns, arithmetic sequences, and basic algebraic relationships through interactive number lines and graphical representations.',
      difficulty: 'Developing',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Identify and extend number patterns visually',
        'Explore arithmetic sequences through interactive tools',
        'Understand the relationship between patterns and algebra',
        'Create and manipulate number line representations'
      ],
      estimatedDuration: 50,
      keywords: ['patterns', 'sequences', 'algebra', 'number line', 'visualization']
    }
  ],
  'Year 8 Interactive Mathematics': [
    {
      name: 'Linear Functions and Graphing',
      description: 'Explore linear relationships through interactive graphing tools. Manipulate slope, y-intercept, and observe real-time changes to understand function behavior.',
      difficulty: 'Developing',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Graph linear functions using interactive tools',
        'Understand the relationship between equation and graph',
        'Manipulate slope and intercept to see changes',
        'Solve linear equations graphically'
      ],
      estimatedDuration: 75,
      keywords: ['linear functions', 'graphing', 'slope', 'intercept', 'equations']
    },
    {
      name: 'Coordinate Geometry Explorations',
      description: 'Investigate coordinate geometry concepts through interactive plotting and transformation tools. Explore distance, midpoint, and geometric relationships.',
      difficulty: 'Proficient',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Plot and manipulate points on coordinate planes',
        'Calculate distances and midpoints interactively',
        'Explore geometric transformations dynamically',
        'Understand coordinate relationships through visualization'
      ],
      estimatedDuration: 65,
      keywords: ['coordinate geometry', 'plotting', 'transformations', 'distance', 'midpoint']
    }
  ],
  'Year 9 Interactive Mathematics': [
    {
      name: 'Quadratic Functions and Parabolas',
      description: 'Explore quadratic functions through interactive parabola manipulation. Understand vertex form, factored form, and the relationship between algebra and geometry.',
      difficulty: 'Proficient',
      strand: 'Number and Algebra',
      learningObjectives: [
        'Graph quadratic functions interactively',
        'Manipulate parameters to understand function behavior',
        'Find roots, vertex, and axis of symmetry dynamically',
        'Connect algebraic and geometric representations'
      ],
      estimatedDuration: 80,
      keywords: ['quadratic functions', 'parabolas', 'vertex', 'roots', 'graphing']
    },
    {
      name: 'Trigonometry and Circles',
      description: 'Investigate trigonometric ratios through interactive circle and triangle constructions. Explore sine, cosine, and tangent relationships dynamically.',
      difficulty: 'Advanced',
      strand: 'Measurement and Geometry',
      learningObjectives: [
        'Construct interactive unit circles',
        'Explore trigonometric ratios through manipulation',
        'Understand periodic behavior of trig functions',
        'Apply trigonometry to solve problems dynamically'
      ],
      estimatedDuration: 90,
      keywords: ['trigonometry', 'circles', 'sine', 'cosine', 'unit circle', 'ratios']
    }
  ],
  'Year 10 Interactive Mathematics': [
    {
      name: 'Statistical Data Visualization',
      description: 'Create and manipulate statistical displays using interactive tools. Explore distributions, correlation, and regression through dynamic data analysis.',
      difficulty: 'Advanced',
      strand: 'Statistics and Probability',
      learningObjectives: [
        'Create interactive statistical displays',
        'Explore data distributions dynamically',
        'Investigate correlation and regression',
        'Analyze real data sets interactively'
      ],
      estimatedDuration: 85,
      keywords: ['statistics', 'data visualization', 'correlation', 'regression', 'distributions']
    }
  ]
};

// Sample activities with GeoGebra configurations
const geogebraActivities = [
  {
    topicName: 'Basic Geometric Constructions',
    activity: {
      title: 'Interactive Triangle Constructor',
      description: 'Students use GeoGebra tools to construct triangles and explore their properties. They can manipulate vertices and observe how angle measures and side lengths change in real-time.',
      activityType: 'Interactive',
      resources: [
        {
          title: 'GeoGebra Triangle Construction Applet',
          url: 'https://www.geogebra.org/m/triangle-constructor',
          type: 'Interactive',
          description: 'Interactive applet for triangle construction and exploration',
          geogebraConfig: {
            width: 800,
            height: 600,
            showToolBar: true,
            showAlgebraInput: false,
            showMenuBar: false,
            material_id: 'geometry',
            rounding: 2
          }
        },
        {
          title: 'Construction Guide',
          url: 'https://example.com/triangle-guide.pdf',
          type: 'PDF',
          description: 'Step-by-step construction instructions'
        }
      ],
      source: 'Internal',
      difficulty: 'Foundation',
      estimatedDuration: 45,
      classSize: { min: 1, max: 30 },
      materialsNeeded: ['Computers/tablets', 'Internet access', 'GeoGebra account (optional)'],
      learningOutcomes: [
        'Students can construct triangles using digital tools',
        'Students understand the relationship between angles and sides',
        'Students can identify different types of triangles'
      ],
      keywords: ['triangles', 'construction', 'geometry', 'interactive', 'properties'],
      geogebraInstructions: [
        'Open the triangle construction applet',
        'Use the polygon tool to create a triangle',
        'Drag vertices to see how the triangle changes',
        'Measure angles and sides using the measurement tools',
        'Try to construct specific types of triangles (equilateral, isosceles, etc.)'
      ]
    }
  },
  {
    topicName: 'Linear Functions and Graphing',
    activity: {
      title: 'Function Slider Exploration',
      description: 'Students manipulate sliders to change the slope and y-intercept of linear functions, observing real-time changes to the graph and understanding the relationship between algebraic and graphical representations.',
      activityType: 'Interactive',
      resources: [
        {
          title: 'Linear Function Explorer',
          url: 'https://www.geogebra.org/m/linear-functions',
          type: 'Interactive',
          description: 'Interactive linear function with parameter sliders',
          geogebraConfig: {
            width: 800,
            height: 600,
            showToolBar: true,
            showAlgebraInput: true,
            showMenuBar: false,
            perspective: 'G',
            algebraInputPosition: 'bottom'
          }
        },
        {
          title: 'Function Investigation Worksheet',
          url: 'https://example.com/linear-worksheet.pdf',
          type: 'PDF',
          description: 'Guided questions for function exploration'
        }
      ],
      source: 'Internal',
      difficulty: 'Developing',
      estimatedDuration: 60,
      classSize: { min: 1, max: 30 },
      materialsNeeded: ['Computers/tablets', 'Internet access', 'Investigation worksheet'],
      learningOutcomes: [
        'Students understand the effect of slope on line steepness',
        'Students can identify y-intercept from graphs and equations',
        'Students can predict graph changes from equation changes'
      ],
      keywords: ['linear functions', 'slope', 'y-intercept', 'graphing', 'sliders'],
      geogebraInstructions: [
        'Open the linear function explorer applet',
        'Use sliders to change the slope (m) and y-intercept (b)',
        'Observe how the line changes on the graph',
        'Try to create lines with specific slopes and intercepts',
        'Use the algebra view to see the equation update automatically'
      ]
    }
  },
  {
    topicName: 'Quadratic Functions and Parabolas',
    activity: {
      title: 'Parabola Parameter Investigation',
      description: 'Students explore how changes to parameters in quadratic functions affect the shape, position, and orientation of parabolas using interactive sliders and dynamic graphing.',
      activityType: 'Interactive',
      resources: [
        {
          title: 'Quadratic Function Explorer',
          url: 'https://www.geogebra.org/m/quadratic-explorer',
          type: 'Interactive',
          description: 'Interactive quadratic function with parameter controls',
          geogebraConfig: {
            width: 800,
            height: 600,
            showToolBar: true,
            showAlgebraInput: true,
            showMenuBar: false,
            perspective: 'G',
            algebraInputPosition: 'bottom',
            showGridlines: true
          }
        },
        {
          title: 'Parabola Analysis Guide',
          url: 'https://example.com/parabola-guide.pdf',
          type: 'PDF',
          description: 'Structured investigation questions'
        }
      ],
      source: 'Internal',
      difficulty: 'Proficient',
      estimatedDuration: 75,
      classSize: { min: 1, max: 30 },
      materialsNeeded: ['Computers/tablets', 'Internet access', 'Analysis worksheet'],
      learningOutcomes: [
        'Students understand the effect of parameters on parabola shape',
        'Students can identify vertex, axis of symmetry, and roots',
        'Students can connect algebraic and graphical representations'
      ],
      keywords: ['quadratic functions', 'parabolas', 'vertex', 'parameters', 'graphing'],
      geogebraInstructions: [
        'Open the quadratic function explorer',
        'Use sliders to change parameters a, b, and c in y = ax² + bx + c',
        'Observe how each parameter affects the parabola',
        'Find the vertex and axis of symmetry',
        'Explore different forms: standard, vertex, and factored'
      ]
    }
  },
  {
    topicName: 'Statistical Data Visualization',
    activity: {
      title: 'Interactive Data Analysis Project',
      description: 'Students import real data sets into GeoGebra and create various statistical displays including histograms, box plots, and scatter plots to analyze trends and relationships.',
      activityType: 'Project',
      resources: [
        {
          title: 'GeoGebra Statistics Suite',
          url: 'https://www.geogebra.org/m/statistics-suite',
          type: 'Interactive',
          description: 'Comprehensive statistical analysis tools',
          geogebraConfig: {
            width: 800,
            height: 600,
            showToolBar: true,
            showAlgebraInput: false,
            showMenuBar: false,
            perspective: 'S',
            showSpreadsheet: true
          }
        },
        {
          title: 'Sample Data Sets',
          url: 'https://example.com/sample-data.csv',
          type: 'Document',
          description: 'Real-world data for analysis'
        }
      ],
      source: 'Internal',
      difficulty: 'Advanced',
      estimatedDuration: 90,
      classSize: { min: 1, max: 25 },
      materialsNeeded: ['Computers/tablets', 'Internet access', 'Data sets', 'Analysis templates'],
      learningOutcomes: [
        'Students can create and interpret various statistical displays',
        'Students understand measures of center and spread',
        'Students can identify patterns and relationships in data'
      ],
      keywords: ['statistics', 'data analysis', 'visualization', 'correlation', 'distributions'],
      geogebraInstructions: [
        'Open the statistics suite in GeoGebra',
        'Import data using the spreadsheet view',
        'Create histograms and box plots from the data',
        'Calculate mean, median, and standard deviation',
        'Look for correlations using scatter plots'
      ]
    }
  }
];

async function addGeoGebraSubject() {
  try {
    console.log('🔵 Adding Interactive Mathematics (GeoGebra) subject...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if subject already exists
    const existingSubject = await Subject.findOne({ name: geogebraSubject.name });
    if (existingSubject) {
      console.log('⚠️  Interactive Mathematics subject already exists!');
      return;
    }

    // Create the subject
    console.log('📚 Creating subject...');
    const subject = new Subject(geogebraSubject);
    await subject.save();
    console.log(`✅ Created subject: ${subject.name}`);

    // Create year groups
    console.log('\n🎓 Creating year groups...');
    const createdYearGroups = {};
    for (const ygData of geogebraYearGroups) {
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
    for (const [yearGroupName, topics] of Object.entries(geogebraTopics)) {
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
    console.log('\n🎯 Creating sample GeoGebra activities...');
    let totalActivities = 0;
    for (const activityData of geogebraActivities) {
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
        console.log(`    🎯 Added GeoGebra activity: ${activity.title}`);
      }
    }

    // Update subject statistics
    await Subject.findByIdAndUpdate(subject._id, {
      totalTopics: totalTopics,
      totalActivities: totalActivities
    });

    console.log('\n🎉 Interactive Mathematics (GeoGebra) subject added successfully!');
    console.log(`📊 Summary:`);
    console.log(`   Subject: ${subject.name}`);
    console.log(`   Year Groups: ${Object.keys(createdYearGroups).length}`);
    console.log(`   Topics: ${totalTopics}`);
    console.log(`   GeoGebra Activities: ${totalActivities}`);
    console.log(`   Color Theme: ${subject.colorTheme}`);

  } catch (error) {
    console.error('❌ Error adding Interactive Mathematics subject:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📝 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  addGeoGebraSubject();
}

module.exports = addGeoGebraSubject;