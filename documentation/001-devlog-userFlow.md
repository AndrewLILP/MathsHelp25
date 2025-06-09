# MathsHelp25 Platform Development Log

## Testing Guide & User Flows

This development log documents the current state of the MathsHelp25 mathematics education platform and provides testing scenarios for different user roles.

Visit: https://mathshelp25-frontend.onrender.com/

Note: documentation/002-devlog-userPermissions.md
contains details of a feature branch ready to be pushed to main that shows improved permissions for users after testing 
 
---

## Platform Overview

MathsHelp25 is an interactive educational resource hub designed for mathematics teachers and students. The platform features:
- **Role-based authentication** (Admin, Teacher, Student)
- **Interactive mathematical tools** with GeoGebra integration
- **Activity creation and sharing** capabilities
- **Subject and topic organization** by year groups
- **Real-time mathematical visualizations**

---

## Test User Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `admin@mathshelp25.com` | `Demo123!` | Full platform management access |
| **Teacher** | `teacher@mathshelp25.com` | `Demo123!` | Content creation and management |
| **Student** | `student@mathshelp25.com` | `Demo123!` | Resource viewing and learning |

---

## User Flow Testing Scenarios

### 🔧 Admin User Flow

**Login:** `admin@mathshelp25.com` / `Demo123!`

**Test Path:**
1. **Navigate to Subjects** → Click "Subjects" in top navbar
2. **Explore Algebra** → Select "Algebra" subject card
3. **Select Topic** → Choose "Solve Simple Equations" topic
4. **Try Interactive Tool** → Click "Interactive Tool" tab (Geogebra API)
   - Enter equation example: `y = 5x + 6`
   - Test parameter adjustments and visualization
5. **View Activities** → Switch to "Activities" tab
6. **Logout** → Use username dropdown menu after exploring admin

**Admin Features Tested:**
- ✅ Subject navigation and filtering
- ✅ Interactive GeoGebra integration
- ✅ Topic exploration
- ✅ Activity viewing

---

### 👩‍🏫 Teacher User Flow

**Login:** `teacher@mathshelp25.com` / `Demo123!`

**Test Path:**
1. **Create New Activity** → Click "Create" → "New Activity"
2. **Select Subject** → Choose from dropdown: "Real World Problems"
3. **Select Year Group** → Choose "Year 7 Real World Problems"
4. **Select Topic** → Choose "Budgeting and Personal Finance" topic
5. **Fill Activity Form** → Complete all required fields
6. **Submit Activity** → Click "Create Activity"
7. **Navigate to Subjects** → Click "Subjects" in navbar
8. **Browse Activities** → Select "Real World Problems", "Budgeting and Personal Finance" → "View Activities" to see your entry
9. **Logout** → Use username dropdown after exploring teacher account

**Teacher Features Tested:**
- ✅ Activity creation workflow
- ✅ Subject/topic selection
- ✅ Form submission
- ✅ Content management

**Notes:**
- 📝 **Dashboard**: To be developed
- 🔧 **View Details Button**: Needs implementation
- 🔧 **Filter/Sort Options**: Needs implementation

---

### 👨‍🎓 Student User Flow

**Login:** `student@mathshelp25.com` / `Demo123!`

**Test Path:**
1. **Browse Subjects** → Click "Subjects" in navbar
2. **Use Category Filters** → Test filter buttons:
   - Advanced
   - Primary  
   - Secondary
   - All
3. **Explore Content** → Browse available subjects and activities
4. **Logout** → Use username dropdown

**Student Features Tested:**
- ✅ Subject browsing
- ✅ Category filtering
- ✅ Content exploration

**Notes:**
- 📝 **Favourites Feature**: To be developed
- 📝 **Progress Tracking**: To be developed

---

## Current Implementation Status

### ✅ Completed Features

- **Authentication System** with Auth0 integration
- **Role-based Access Control** (Admin/Teacher/Student)
- **Subject Management** with categorization
- **Interactive Tools** with GeoGebra integration
- **Activity Creation** workflow for teachers
- **Topic Navigation** and exploration
- **Responsive Design** with Bootstrap styling

### 🔧 In Development

- **Dashboard** for users
- **Activity Detail Views** with full information
- **Filter and Sort** functionality for activities
- **Student Progress Tracking**
- **Favourites System** for students

### 📋 Backend Architecture

- **Node.js/Express** API server
- **MongoDB Atlas** for data persistence
- **Auth0** for authentication
- **RESTful endpoints** for all operations

### 🎨 Frontend Architecture

- **React 18** with functional components
- **Bootstrap 5** for styling
- **React Router** for navigation
- **Auth0 React SDK** for authentication

---

## Database Configuration

### MongoDB Atlas Setup
- Production database configured
- Collections: Users, Subjects, YearGroups, Topics, Activities
- Seeded with sample mathematics curriculum data

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://...
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
PORT=5000

# Frontend (.env)
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com  
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_API_URL=http://localhost:5000