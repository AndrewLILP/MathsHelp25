// File: 01backend/test-env.js - Run this to check your environment
require('dotenv').config();

console.log('🧪 Testing Environment Configuration...\n');

// Check required environment variables
const requiredVars = {
  'AUTH0_DOMAIN': process.env.AUTH0_DOMAIN,
  'AUTH0_AUDIENCE': process.env.AUTH0_AUDIENCE,
  'MONGODB_URI': process.env.MONGODB_URI ? '✅ Set' : '❌ Missing',
  'PORT': process.env.PORT || '5000 (default)',
  'NODE_ENV': process.env.NODE_ENV || 'development (default)'
};

console.log('📋 Environment Variables:');
console.log('========================');
for (const [key, value] of Object.entries(requiredVars)) {
  const status = value ? '✅' : '❌';
  console.log(`${status} ${key}: ${value || 'MISSING'}`);
}

// Check Auth0 configuration
console.log('\n🔐 Auth0 Configuration:');
console.log('======================');
if (process.env.AUTH0_DOMAIN && process.env.AUTH0_AUDIENCE) {
  console.log('✅ Auth0 domain and audience are set');
  console.log(`   Domain: ${process.env.AUTH0_DOMAIN}`);
  console.log(`   Audience: ${process.env.AUTH0_AUDIENCE}`);
  
  // Test JWKS URL
  const jwksUrl = `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`;
  console.log(`   JWKS URL: ${jwksUrl}`);
  
} else {
  console.log('❌ Auth0 configuration incomplete');
  if (!process.env.AUTH0_DOMAIN) console.log('   Missing: AUTH0_DOMAIN');
  if (!process.env.AUTH0_AUDIENCE) console.log('   Missing: AUTH0_AUDIENCE');
}

// Test MongoDB connection string
console.log('\n💾 Database Configuration:');
console.log('=========================');
if (process.env.MONGODB_URI) {
  if (process.env.MONGODB_URI.includes('mongodb+srv://')) {
    console.log('✅ MongoDB Atlas connection string detected');
  } else if (process.env.MONGODB_URI.includes('mongodb://')) {
    console.log('✅ MongoDB local connection string detected');
  } else {
    console.log('⚠️  Unusual MongoDB URI format');
  }
} else {
  console.log('❌ MONGODB_URI not set');
}

console.log('\n🎯 Next Steps:');
console.log('=============');
if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  console.log('1. Update your .env file with Auth0 configuration');
  console.log('2. Restart the server');
} else {
  console.log('1. Replace middleware/auth.js with the fixed version');
  console.log('2. Update your route files to import from middleware/auth');
  console.log('3. Start the server: npm run dev');
}

console.log('\n🔧 Current .env should contain:');
console.log('==============================');
console.log('AUTH0_DOMAIN=dev-u68cyweem7dpptng.us.auth0.com');
console.log('AUTH0_AUDIENCE=https://mathshelp25.com/api');
console.log('MONGODB_URI=mongodb+srv://...');
console.log('PORT=5000');
console.log('NODE_ENV=development');
console.log('FRONTEND_URL=http://localhost:3000');