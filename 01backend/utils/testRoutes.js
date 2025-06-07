// File: 01backend/utils/testRoutes.js

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000/api';
const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m'
};

// Helper function to make API calls
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      error: error.response?.data || error.message
    };
  }
}

// Test functions
async function testEndpoint(name, method, url, expectedStatus = 200) {
  console.log(`${COLORS.BLUE}Testing: ${name}${COLORS.RESET}`);
  const result = await makeRequest(method, url);
  
  if (result.success && result.status === expectedStatus) {
    console.log(`${COLORS.GREEN}✅ PASS${COLORS.RESET} - ${method} ${url} - Status: ${result.status}`);
    if (result.data?.data) {
      console.log(`   Data count: ${Array.isArray(result.data.data) ? result.data.data.length : 'object'}`);
    }
  } else {
    console.log(`${COLORS.RED}❌ FAIL${COLORS.RESET} - ${method} ${url} - Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
  }
  console.log('');
}

async function runTests() {
  console.log(`${COLORS.YELLOW}🧪 Starting API Route Tests${COLORS.RESET}\n`);
  
  // Test server root
  console.log(`${COLORS.YELLOW}=== Server Health Check ===${COLORS.RESET}`);
  await testEndpoint('Server Root', 'GET', '/../', 200);
  
  // Test subjects endpoints
  console.log(`${COLORS.YELLOW}=== Subjects Endpoints ===${COLORS.RESET}`);
  await testEndpoint('Get All Subjects', 'GET', '/subjects');
  await testEndpoint('Get Subject Categories', 'GET', '/subjects/categories/list');
  
  // Test year groups endpoints
  console.log(`${COLORS.YELLOW}=== Year Groups Endpoints ===${COLORS.RESET}`);
  await testEndpoint('Get All Year Groups', 'GET', '/year-groups');
  
  // Test topics endpoints
  console.log(`${COLORS.YELLOW}=== Topics Endpoints ===${COLORS.RESET}`);
  await testEndpoint('Get All Topics', 'GET', '/topics');
  await testEndpoint('Get Topic Strands', 'GET', '/topics/strands/list');
  await testEndpoint('Get Popular Topics', 'GET', '/topics/popular');
  
  // Test activities endpoints
  console.log(`${COLORS.YELLOW}=== Activities Endpoints ===${COLORS.RESET}`);
  await testEndpoint('Get All Activities', 'GET', '/activities');
  await testEndpoint('Get Activity Types', 'GET', '/activities/types/list');
  
  // Test auth endpoints (these will fail without token, but should return 401)
  console.log(`${COLORS.YELLOW}=== Auth Endpoints (Should Fail) ===${COLORS.RESET}`);
  await testEndpoint('Get User Profile (No Auth)', 'GET', '/auth/me', 401);
  
  console.log(`${COLORS.YELLOW}✨ API Route Tests Completed${COLORS.RESET}`);
}

// Test specific endpoints with sample data
async function testWithSampleData() {
  console.log(`${COLORS.YELLOW}\n🔍 Testing with Sample Data${COLORS.RESET}\n`);
  
  // Get first subject and test deeper
  const subjectsResult = await makeRequest('GET', '/subjects');
  if (subjectsResult.success && subjectsResult.data.data.length > 0) {
    const firstSubject = subjectsResult.data.data[0];
    console.log(`${COLORS.BLUE}Testing with Subject: ${firstSubject.name}${COLORS.RESET}`);
    
    // Test year groups for this subject
    await testEndpoint(
      `Get Year Groups for ${firstSubject.name}`, 
      'GET', 
      `/year-groups/subject/${firstSubject._id}`
    );
    
    // Get year groups to test topics
    const yearGroupsResult = await makeRequest('GET', `/year-groups/subject/${firstSubject._id}`);
    if (yearGroupsResult.success && yearGroupsResult.data.data.length > 0) {
      const firstYearGroup = yearGroupsResult.data.data[0];
      console.log(`${COLORS.BLUE}Testing with Year Group: ${firstYearGroup.name}${COLORS.RESET}`);
      
      // Test topics for this year group
      await testEndpoint(
        `Get Topics for ${firstYearGroup.name}`, 
        'GET', 
        `/topics/year-group/${firstYearGroup._id}`
      );
      
      // Get topics to test activities
      const topicsResult = await makeRequest('GET', `/topics/year-group/${firstYearGroup._id}`);
      if (topicsResult.success && topicsResult.data.data.length > 0) {
        const firstTopic = topicsResult.data.data[0];
        console.log(`${COLORS.BLUE}Testing with Topic: ${firstTopic.name}${COLORS.RESET}`);
        
        // Test activities for this topic
        await testEndpoint(
          `Get Activities for ${firstTopic.name}`, 
          'GET', 
          `/activities/topic/${firstTopic._id}`
        );
        
        // Test getting single topic
        await testEndpoint(
          `Get Single Topic`, 
          'GET', 
          `/topics/${firstTopic._id}`
        );
      }
    }
  }
}

// Main execution
async function main() {
  await runTests();
  await testWithSampleData();
  
  console.log(`\n${COLORS.GREEN}🎉 All tests completed!${COLORS.RESET}`);
  console.log(`${COLORS.YELLOW}💡 To test authenticated routes, you'll need to:${COLORS.RESET}`);
  console.log(`   1. Set up Auth0 properly`);
  console.log(`   2. Get a valid JWT token`);
  console.log(`   3. Include it in the Authorization header`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { makeRequest, testEndpoint };