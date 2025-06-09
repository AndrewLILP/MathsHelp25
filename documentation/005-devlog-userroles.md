# User Roles and Permissions System - DevLog

**Date:** June 8, 2025  
**Project:** MathsHelp25  
**Topic:** User Authentication, Roles, and Permissions  

## Overview

MathsHelp25 implements a role-based access control (RBAC) system using Auth0 for authentication and custom middleware for authorization. This document outlines how the current system works and identifies areas for improvement. I don't want to break things before the submission of the Capstone Project.

## Current Role System

### Supported Roles

The system currently has **inconsistent role definitions** between frontend and backend:
Demo accounts have been created in Auth0 for admin, teacher and student

**Backend User Model (`User.js`):**
- `teacher` (default role)
- `department_head` ❌
- `admin`

**Frontend Role Selection (`RoleSelection.js`):**
- `teacher`
- `student`
- `admin`

⚠️ **Issue**: Backend doesn't support 'student' role, but frontend offers it

### Default Behavior
- New users default to `teacher` role
- All users can view public content (subjects, topics, activities)
- Role selection required on first login

## Authentication Flow

### 1. Initial Authentication
```javascript
// Auth0ProviderWithHistory.js
Auth0Provider -> JWT tokens -> audience verification
```

### 2. User Creation/Retrieval
```javascript
// middleware/auth.js - getOrCreateUser()
1. Check if user exists in MongoDB by auth0Id
2. If new user: create with default 'teacher' role
3. If existing: update lastLoginAt timestamp
4. Attach user to req.currentUser
```

### 3. Role Selection (First Time Only)
```javascript
// AuthWrapper.js flow
isAuthenticated? -> hasRole? -> showRoleSelection() -> storeRole()
```

### 4. Role Storage
- **Primary**: Auth0 user metadata (`https://mathshelp25.com/role`)
- **Backup**: localStorage (`userRole_${user.sub}`)
- **Database**: MongoDB User document

## Permission System

### Permission Helper Functions (`useUserRole.js`)

```javascript
const permissions = {
  canCreate: () => hasAnyRole(['teacher', 'admin']),
  canManage: () => hasRole('admin'),
  canRate: () => hasAnyRole(['teacher', 'student', 'admin']),
  canViewAll: () => hasAnyRole(['teacher', 'student', 'admin'])
}
```

### Role-Based UI Features

#### **Teacher Role**
- ✅ Create and manage activities
- ✅ Access teacher dashboard
- ✅ Rate and view all content
- ✅ Update own contributions
- ❌ Cannot manage users or system settings

#### **Student Role** (Frontend Only)
- ✅ View all public content
- ✅ Rate activities and bookmark favorites
- ✅ Track personal progress
- ❌ Cannot create or manage content

#### **Admin Role**
- ✅ All teacher permissions
- ✅ User management and role assignment
- ✅ Content moderation and management
- ✅ System analytics and settings
- ✅ Create/edit topics and subjects

#### **Department Head Role** (Backend Only)
- ✅ All teacher permissions
- ✅ Content management within department
- ✅ Topic and subject creation
- ❌ Limited user management compared to admin

## API Route Protection

### Middleware Implementation
```javascript
// Backend middleware chain
optionalAuth -> getOptionalUser  // For public routes
checkJwt -> getOrCreateUser      // For protected routes
requireRole(['admin', 'teacher']) // For role-specific routes
```

### Protection Levels

#### **Public Access**
- `GET /api/subjects` - View subjects
- `GET /api/topics` - View topics  
- `GET /api/activities` - View activities

#### **Authenticated Users**
- `POST /api/activities/:id/rate` - Rate activities
- `GET /api/auth/me` - Get user profile

#### **Teachers + Admins**
- `POST /api/activities` - Create activities
- `PUT /api/activities/:id` - Update own activities

#### **Admin/Department Head Only**
- `POST /api/topics` - Create topics
- `POST /api/subjects` - Create subjects
- `DELETE /api/activities/:id` - Delete any activity

## Key Components

### Backend Files
- **`middleware/auth.js`**: JWT verification, user creation, role checking
- **`models/User.js`**: User schema with role enum
- **`routes/auth.js`**: User profile and role management endpoints

### Frontend Files
- **`AuthWrapper.js`**: Manages authentication flow and role checking
- **`RoleSelection.js`**: First-time role selection UI
- **`useUserRole.js`**: React hook for permission checking
- **`RoleBasedNavigation.js`**: Dynamic navigation based on user role

## Current Issues & Required Fixes

### 🔴 Critical Issues

1. **Role Inconsistency**
   ```javascript
   // Backend User.js needs to include 'student'
   role: {
     type: String,
     enum: ['student', 'teacher', 'department_head', 'admin'], // Add 'student'
     default: 'student' // Change from 'teacher'
   }
   ```

2. **Default Role Logic**
   - Should default to 'student' for safety
   - Teachers should explicitly request teacher role

3. **Missing Student Features**
   - Backend doesn't handle student-specific logic
   - Need student progress tracking
   - Need bookmark/favorites system

### 🟡 Improvements Needed

1. **Role Management API**
   ```javascript
   // Missing endpoints
   PUT /api/auth/change-role     // Users change their own role
   PUT /api/admin/users/:id/role // Admins change user roles
   ```

2. **Enhanced Permissions**
   - Granular permissions (create vs edit vs delete)
   - Department-based permissions
   - Subject-specific teacher assignments

3. **Better Error Handling**
   - Clear permission denied messages
   - Role upgrade request system
   - Audit trail for role changes

## Environment Setup

### Auth0 Configuration Required
```env
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://mathshelp25.com/api
REACT_APP_AUTH0_CLIENT_ID=your-client-id
```

### Database Schema
```javascript
// User model includes authentication and role data
auth0Id: String (unique identifier)
role: String (enum with permissions)
lastLoginAt: Date (for analytics)
```

## Testing Considerations

### Role-Based Testing
- Test each role's access permissions
- Verify role selection flow for new users  
- Test role upgrade/downgrade scenarios
- Ensure JWT token validation works

### Security Testing
- Verify unauthorized access prevention
- Test token expiration handling
- Confirm role-based API protection

## Next Steps

1. **Fix role inconsistency** - Add 'student' to backend enum
2. **Implement missing student features** - Bookmarks, progress tracking
3. **Add role management endpoints** - Allow role changes post-registration
4. **Enhance permission granularity** - More specific permissions per role
5. **Add audit logging** - Track role changes and permission usage

---

**Status**: ⚠️ Functional but needs consistency fixes  
**Priority**: High (role inconsistency affects user experience)  
**Next Review**: After role fixes are implemented