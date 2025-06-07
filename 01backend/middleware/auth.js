// File: 01backend/middleware/auth.js
// FIXED VERSION - Gets user profile from Auth0 userinfo endpoint

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const axios = require('axios'); // Add this import
const User = require('../models/User');

console.log('🔐 Loading FIXED Auth0 JWT middleware...');

// Validate environment variables
if (!process.env.AUTH0_DOMAIN) {
  console.error('❌ AUTH0_DOMAIN is required in .env file');
  process.exit(1);
}

if (!process.env.AUTH0_AUDIENCE) {
  console.error('❌ AUTH0_AUDIENCE is required in .env file');
  process.exit(1);
}

// JWKS client for Auth0 public keys
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  requestHeaders: {},
  timeout: 30000,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

console.log(`✅ JWKS client configured for: ${process.env.AUTH0_DOMAIN}`);

// Get signing key function
function getKey(header, callback) {
  console.log('🔑 Getting signing key for kid:', header.kid);
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('❌ Error getting signing key:', err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    console.log('✅ Signing key retrieved successfully');
    callback(null, signingKey);
  });
}

// JWT verification middleware
function checkJwt(req, res, next) {
  console.log('\n🔍 checkJwt called for:', req.method, req.path);
  
  const authHeader = req.headers.authorization;
  console.log('📋 Authorization header:', authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : 'MISSING');
  
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      code: 'NO_TOKEN'
    });
  }

  console.log('🔍 Token found, verifying...');
  console.log('🎯 Expected audience:', process.env.AUTH0_AUDIENCE);
  console.log('🎯 Expected issuer:', `https://${process.env.AUTH0_DOMAIN}/`);

  // Verify the JWT token
  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.error('❌ JWT verification failed:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    console.log('✅ JWT verified successfully!');
    console.log('👤 User subject:', decoded.sub);
    
    req.auth0User = decoded;
    req.auth0Token = token; // Store token for userinfo call
    next();
  });
}

// FIXED: Get user profile from Auth0 userinfo endpoint
async function getUserInfoFromAuth0(token) {
  try {
    console.log('🔍 Getting user profile from Auth0 userinfo...');
    
    const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 5000
    });
    
    console.log('✅ Got user profile from Auth0');
    return response.data;
  } catch (error) {
    console.error('❌ Error getting user info from Auth0:', error.message);
    throw error;
  }
}

// FIXED: Get or create user middleware with userinfo call
async function getOrCreateUser(req, res, next) {
  console.log('\n🔍 getOrCreateUser called');
  
  try {
    if (!req.auth0User || !req.auth0Token) {
      console.log('❌ No auth0User or token found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH_USER'
      });
    }

    const { sub: auth0Id } = req.auth0User;
    console.log('🔍 Looking for user with auth0Id:', auth0Id);

    // Get user profile from Auth0 userinfo endpoint
    let userProfile;
    try {
      userProfile = await getUserInfoFromAuth0(req.auth0Token);
      console.log('📧 Email from userinfo:', userProfile.email);
      console.log('👤 Name from userinfo:', userProfile.name);
    } catch (error) {
      console.error('❌ Failed to get user profile from Auth0:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error getting user profile',
        code: 'USERINFO_ERROR'
      });
    }

    // Find existing user or create new one
    let user = await User.findOne({ auth0Id });

    if (!user) {
      console.log('👤 Creating new user...');
      
      // Use data from userinfo endpoint
      const email = userProfile.email;
      const name = userProfile.name || userProfile.nickname || email?.split('@')[0] || 'MathsHelp25 User';
      const picture = userProfile.picture || '';

      if (!email) {
        console.error('❌ No email found in user profile');
        return res.status(400).json({
          success: false,
          message: 'User email is required',
          code: 'MISSING_EMAIL'
        });
      }

      // Create new user
      user = new User({
        auth0Id,
        email,
        name,
        profileImage: picture,
        role: 'teacher', // Default role - can be changed later
        lastLoginAt: new Date()
      });
      
      await user.save();
      console.log('✅ Created new user:', email, 'with role:', user.role);
    } else {
      console.log('✅ Found existing user:', userProfile.email, 'role:', user.role);
      
      // Update user profile with latest info from Auth0
      if (userProfile.email && user.email !== userProfile.email) {
        user.email = userProfile.email;
      }
      if (userProfile.name && user.name !== userProfile.name) {
        user.name = userProfile.name;
      }
      if (userProfile.picture && user.profileImage !== userProfile.picture) {
        user.profileImage = userProfile.picture;
      }
      
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    }

    req.currentUser = user;
    console.log('✅ User attached to request');
    next();
  } catch (error) {
    console.error('❌ Error in getOrCreateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      code: 'USER_CREATE_ERROR',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Role-based authorization
function requireRole(allowedRoles) {
  return function(req, res, next) {
    console.log('\n🔍 requireRole called for roles:', allowedRoles);
    
    if (!req.currentUser) {
      console.log('❌ No currentUser found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_USER'
      });
    }

    console.log('👤 User role:', req.currentUser.role);
    
    if (!allowedRoles.includes(req.currentUser.role)) {
      console.log('❌ Role check failed');
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.currentUser.role}`,
        code: 'INSUFFICIENT_ROLE'
      });
    }

    console.log('✅ Role check passed');
    next();
  };
}

// Optional authentication middleware
function optionalAuth(req, res, next) {
  console.log('\n🔍 optionalAuth called for:', req.method, req.path);
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;
  
  if (!token) {
    console.log('🔍 No token in optional auth, continuing...');
    req.auth0User = null;
    req.auth0Token = null;
    return next();
  }

  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.log('🔍 Optional auth failed (continuing):', err.message);
      req.auth0User = null;
      req.auth0Token = null;
    } else {
      console.log('✅ Optional auth succeeded for:', decoded.sub);
      req.auth0User = decoded;
      req.auth0Token = token;
    }
    next();
  });
}

// Optional user middleware
async function getOptionalUser(req, res, next) {
  console.log('\n🔍 getOptionalUser called');
  
  try {
    if (!req.auth0User || !req.auth0Token) {
      console.log('🔍 No auth0User/token, setting currentUser to null');
      req.currentUser = null;
      return next();
    }

    // Get user profile from Auth0 if we have a token
    let userProfile;
    try {
      userProfile = await getUserInfoFromAuth0(req.auth0Token);
    } catch (error) {
      console.log('⚠️ Failed to get userinfo in optional auth:', error.message);
      req.currentUser = null;
      return next();
    }

    const user = await User.findOne({ auth0Id: req.auth0User.sub });
    req.currentUser = user;
    console.log('✅ Optional user set:', user ? userProfile.email : 'null');
    next();
  } catch (error) {
    console.error('❌ Error in getOptionalUser:', error);
    req.currentUser = null;
    next();
  }
}

console.log('✅ FIXED Auth0 JWT middleware loaded successfully');

module.exports = {
  checkJwt,
  getOrCreateUser,
  requireRole,
  optionalAuth,
  getOptionalUser
};