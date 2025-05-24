// Temporary middleware that bypasses authentication for testing

// Mock authentication - allows all requests through
const checkJwt = (req, res, next) => {
  console.log('📝 Bypassing JWT check for testing');
  next();
};

// Mock user creation - creates a test user
const getOrCreateUser = (req, res, next) => {
  try {
    // Mock user for testing
    req.currentUser = {
      _id: '507f1f77bcf86cd799439011', // Valid ObjectId for testing
      name: 'Test Teacher',
      email: 'test@mathshelp25.com',
      role: 'teacher',
      contributedActivities: 0,
      ratingsGiven: 0
    };
    next();
  } catch (error) {
    console.error('Error in mock auth:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Role checking - allows all roles for testing
const requireRole = (roles) => {
  return (req, res, next) => {
    console.log(`📝 Bypassing role check for: ${roles}`);
    next();
  };
};

// Optional auth - always succeeds
const optionalAuth = (req, res, next) => {
  next();
};

// Optional user - no user for public routes
const getOptionalUser = (req, res, next) => {
  req.currentUser = null;
  next();
};

console.log('⚠️  WARNING: Using NO-AUTH middleware for testing only!');

module.exports = {
  checkJwt,
  getOrCreateUser,
  requireRole,
  optionalAuth,
  getOptionalUser
};