# MathsHelp25
A website for Maths/Computing teachers

# 📚 MathsHelp25: Interactive Educational Resource Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/atlas)
[![Auth0](https://img.shields.io/badge/Auth0-JWT-orange.svg)](https://auth0.com/)

> **A comprehensive web application for teachers to discover, share, and create interactive teaching resources with integrated GeoGebra mathematical visualizations.**

## 🌟 **Features**

### 🎓 **For Teachers**
- **Create & Share Activities** - Build comprehensive teaching resources with materials, objectives, and assessments
- **Interactive Mathematical Tools** - Integrate GeoGebra demos for quadratic, linear, trigonometric, and geometric concepts
- **Unit Planning** - Organize topics into structured lesson sequences
- **Resource Management** - Upload, categorize, and rate teaching materials
- **Analytics Dashboard** - Track activity usage and student engagement

### 👨‍🎓 **For Students**
- **Interactive Learning** - Explore mathematical concepts with real-time visualizations
- **Structured Pathways** - Follow organized lesson sequences and unit plans
- **Progress Tracking** - Monitor learning journey and achievements
- **Activity Discovery** - Find engaging activities across all year levels

### 🔐 **For Administrators**
- **User Management** - Approve teacher applications and manage permissions
- **Content Moderation** - Review and approve educational resources
- **System Analytics** - Monitor platform usage and effectiveness
- **Curriculum Oversight** - Ensure educational standards compliance

## 🚀 **Live Demo**

🌐 **Frontend:** [https://mathshelp25-frontend.render.com](https://mathshelp25-frontend.render.com)
🔗 **API:** [https://mathshelp25-backend.render.com](https://mathshelp25-backend.render.com)

### **Demo Accounts**
- **Teacher:** `teacher@mathshelp25.com` / `demo123`
- **Student:** `student@mathshelp25.com` / `demo123`
- **Admin:** `admin@mathshelp25.com` / `demo123`

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Express API   │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Auth0 Login   │    │ • JWT Verify    │    │ • Users         │
│ • GeoGebra      │    │ • CRUD APIs     │    │ • Activities    │
│ • Role-based UI │    │ • Role Checks   │    │ • Topics        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**

#### **Frontend (React.js)**
- **Framework:** React 18+ with functional components and hooks
- **State Management:** React Context API and useState/useReducer
- **Styling:** Bootstrap 5 + Tailwind CSS with custom purple/gold theme
- **Authentication:** Auth0 with Google/Microsoft OAuth + email/password
- **Icons:** React Icons (FontAwesome)
- **Interactive Tools:** GeoGebra API integration

#### **Backend (Node.js/Express)**
- **Runtime:** Node.js 18+
- **Framework:** Express.js with RESTful API design
- **Authentication:** Auth0 JWT verification with role-based permissions
- **Database:** MongoDB with Mongoose ODM
- **Security:** Helmet, CORS, rate limiting, input validation

#### **Database (MongoDB)**
- **Hosting:** MongoDB Atlas (cloud)
- **ODM:** Mongoose with schema validation
- **Structure:** Users, Activities, Topics, YearGroups, Subjects

#### **Deployment**
- **Frontend:** Render.com static hosting
- **Backend:** Render.com web service
- **Database:** MongoDB Atlas
- **CI/CD:** GitHub Actions integration

## 📋 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Auth0 account for authentication
- Git for version control

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/MathsHelp25.git
cd MathsHelp25
```

### **2. Backend Setup**
```bash
cd 01backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see Configuration section)
nano .env

# Start development server
npm run dev
```

### **3. Frontend Setup**
```bash
cd ../01frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see Configuration section)
nano .env

# Start development server
npm start
```

### **4. Database Setup**
```bash
# In backend directory, seed the database
cd 01backend
npm run seed
```

## ⚙️ **Configuration**

### **Backend Environment Variables**
```bash
# 01backend/.env

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathshelp25

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=https://mathshelp25.com/api
```

### **Frontend Environment Variables**
```bash
# 01frontend/.env

# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=https://mathshelp25.com/api

# API Configuration
REACT_APP_API_URL=http://localhost:5000
```

### **Auth0 Setup**

1. **Create Auth0 Application**
   - Application Type: Single Page Application
   - Allowed Callback URLs: `http://localhost:3000`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

2. **Create Auth0 API**
   - Identifier: `https://mathshelp25.com/api`
   - Signing Algorithm: RS256
   - Enable RBAC: Yes

3. **Configure Social Connections**
   - Enable Google and Microsoft OAuth
   - Configure email/password authentication

## 📁 **Project Structure**

```
MathsHelp25/
├── 01frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── activities/   # Activity-related components
│   │   │   ├── topics/       # Topic and lesson components
│   │   │   └── shared/       # Common UI components
│   │   ├── pages/            # Main page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   ├── styles/           # CSS and styling
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── .env
├── 01backend/                  # Express backend API
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Activity.js
│   │   ├── Topic.js
│   │   ├── YearGroup.js
│   │   └── Subject.js
│   ├── routes/               # API route handlers
│   │   ├── auth.js
│   │   ├── activities.js
│   │   ├── topics.js
│   │   ├── subjects.js
│   │   └── yearGroups.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # JWT verification
│   │   └── validation.js    # Input validation
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env
├── docs/                      # Documentation
├── scripts/                   # Deployment and utility scripts
├── README.md
└── LICENSE
```

## 🔧 **API Documentation**

### **Authentication Endpoints**
```http
GET    /api/auth/me              # Get current user profile
PUT    /api/auth/profile         # Update user profile
PUT    /api/auth/role           # Update user role
GET    /api/auth/verify         # Verify JWT token
```

### **Activity Endpoints**
```http
GET    /api/activities                    # List all activities
GET    /api/activities/:id               # Get activity by ID
GET    /api/activities/topic/:topicId    # Get activities by topic
POST   /api/activities                   # Create new activity (teachers)
PUT    /api/activities/:id               # Update activity (creator)
DELETE /api/activities/:id               # Delete activity (creator)
POST   /api/activities/:id/rate          # Rate an activity
```

### **Topic Endpoints**
```http
GET    /api/topics                           # List all topics
GET    /api/topics/:id                       # Get topic by ID
GET    /api/topics/year-group/:yearGroupId   # Get topics by year group
GET    /api/topics/:id/interactive-config    # Get GeoGebra configuration
POST   /api/topics                          # Create topic (admin)
PUT    /api/topics/:id                      # Update topic (admin)
```

### **Subject & Year Group Endpoints**
```http
GET    /api/subjects                    # List all subjects
GET    /api/subjects/:id               # Get subject by ID
GET    /api/year-groups               # List all year groups
GET    /api/year-groups/:id           # Get year group by ID
```

## 🎮 **Interactive Features**

### **GeoGebra Integration**
The platform automatically detects mathematical topics and provides appropriate interactive demonstrations:

- **Quadratic Functions:** `y = ax² + bx + c` with parameter sliders
- **Linear Functions:** `y = mx + b` with slope and intercept controls
- **Trigonometric Functions:** `y = A*sin(Bx + C)` with amplitude, frequency, and phase
- **Geometric Concepts:** Dynamic shapes and relationship exploration

### **Topic Detection**
Topics are automatically categorized based on their names:
```javascript
// Examples of auto-detected interactive demos
"Quadratic Functions" → Parabola explorer with a, b, c sliders
"Linear Equations" → Line explorer with slope and y-intercept
"Sine and Cosine" → Wave function explorer with A, B, C parameters
"Circle Geometry" → Dynamic circle and angle measurement tools
```

## 👥 **User Roles & Permissions**

### **Student (Default)**
- ✅ View all public activities and topics
- ✅ Use interactive mathematical tools
- ✅ Track personal progress
- ✅ Rate and bookmark content
- ❌ Cannot create content

### **Teacher (Application Required)**
- ✅ All student permissions
- ✅ Create and manage activities
- ✅ Access analytics and usage data
- ✅ Create unit plans and lesson sequences
- ❌ Cannot manage users or create topics

### **Admin (Assigned by System)**
- ✅ All teacher permissions
- ✅ Manage user roles and permissio
