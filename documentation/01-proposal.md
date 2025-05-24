# MathsHelp25: Curriculum Management System
## Capstone Project Proposal

### Project Overview
MathsHelp (TeachNotes is a previous name that may appear elsewhere) is a specialized note-taking application designed specifically for high school mathematics and computing teachers. The platform allows educators to organize, store, and retrieve teaching content, resources, and reflections based on subject areas, year levels, and curriculum substrands. This tool aims to solve the common problem of curriculum continuity and knowledge management that teachers face across academic years.

### Problem Statement
High school teachers often struggle with:
- Keeping track of what worked well when teaching specific content
- Documenting effective explanations and examples for complex topics
- Organizing resources across different classes and year levels
- Maintaining continuity when revisiting topics in subsequent years
- Sharing insights with other faculty members teaching the same subjects

### Target Audience
- High school mathematics teachers
- High school computing/IT teachers
- Department heads who need to organize curriculum materials
- Education coordinators managing teaching resources

### Key Features
- Topic cards to feature links to webpages

#### User Authentication
- Secure login/registration system
- User profile management
- Role-based access (individual teacher vs. department head) - school based version
- Role-based access (teacher, admins) - subscription model

#### Content Organization Structure
- Hierarchical navigation (Subject → Year Level → Substrand → Topics)
- Dashboard with recent entries and favorites
- Search functionality across all content
- Tagging system for cross-referencing

#### Note Management
- Rich text editor for detailed notes
- Ability to embed images, links, and code snippets
- Version history to track changes
- Template options for consistent note-taking

#### Resource Attachment
- Upload and link to teaching resources - // single webpages using javascript or react components for version 1 - not bootcamp assignment
- Store external links to useful websites
- Embed video tutorials or demonstrations - NOT this version - maybe in the future
- Connect to assessment items - NOT this version

#### Collaboration Tools
- Optional sharing of notes with colleagues - MAYBE - too complex ?? for this version
- Comment functionality on shared notes - MAYBE
- Export/import capabilities for backup or sharing - print PDF copies 

### Technical Stack

#### Frontend
- **Framework**: React.js
- **State Management**: Context API or Redux (if complexity requires) - NOT SUre - CHECK this 
- **Routing**: React Router for navigation
- **UI Components**: Bootsrap/ CSS for styling - Maybe just CSS
- **HTTP Client**: Axios for API requests

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API Design**: RESTful endpoints
- **Authentication**: JWT (JSON Web Tokens)

#### Database
- **Primary Database**: MongoDB Atlas (cloud-hosted)
- **Schema Design**: Mongoose ODM for data modeling

#### Deployment
- **Frontend Hosting**: Render / Personal website (static build files) - I have a basic website that I might be able to use
- **Backend Hosting**: Render.com or similar service

### Project Phases

#### Design Phase
- System architecture design (frontend components, backend services)
- Database schema design (collections, relationships)
- User interface wireframes and mockups
- API endpoint planning and documentation
- State management and data flow diagrams
- Authentication and authorization design

#### Development Phase
- Project initialization with create-react-app for frontend
- Express/Node.js project setup for backend
- MongoDB Atlas configuration
- Implementation of authentication system
- Development of core components and features
- API integration between frontend and backend
- Implementation of responsive design 
- Documentation of code with JSDoc or similar

#### Testing and Debugging
- Unit tests for React components using Jest/React Testing Library
- API endpoint testing using Postman
- Integration testing of key user flows
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive design testing across device sizes
- Performance optimization
- Security vulnerability assessment

#### Deployment
- Frontend build optimization
- Backend deployment to Render.com
- Database connection and security configuration
- Environment variables setup for sensitive information
- Domain configuration for frontend hosting
- Continuous integration setup via GitHub Actions - NOT SURE ABOUT THIS

### Timeline & Milestones (4-Week Plan)

#### Week 1: Design & Setup
- Complete detailed system architecture design
- Create wireframes and UI mockups
- Set up development environment
- Initialize frontend and backend repositories
- Design database schema
- Implement basic authentication

#### Week 2: Core Functionality
- Develop navigation and routing structure
- Implement note creation and editing features
- Build content organization hierarchy
- Create dashboard components
- Develop API endpoints for CRUD operations
- Connect frontend to backend services

#### Week 3: Advanced Features & Testing
- Implement search functionality
- Add resource attachment capabilities
- Develop tagging system
- Create sharing and collaboration features
- Write unit and integration tests
- Begin debugging and optimization

#### Week 4: Refinement & Deployment
- Complete any remaining features
- Fix bugs and address edge cases
- Optimize performance
- Deploy frontend and backend
- Document setup and usage
- Create project presentation

### Deliverables

#### Live Application
- Fully deployed and accessible web application
- Functional frontend hosted on personal domain
- Working backend API on Render.com
- Connected to MongoDB Atlas database

#### GitHub Repository
- Organized repository with clear directory structure
- Comprehensive README with installation and usage instructions
- Well-documented code with appropriate comments
- Development guidelines and contribution information

#### Development Log (Devlog)
- Weekly progress updates
- Documentation of challenges and solutions
- Screenshots of key milestones
- Code snippets highlighting important implementations
- Learnings and insights throughout the development process

### Future Expansion Possibilities
- Mobile application for on-the-go access
- Integration with popular LMS platforms (Canvas, Moodle)
- AI-assisted content suggestions
- Analytics to track frequently accessed topics
- Department-wide reporting tools

This project will demonstrate my ability to design, develop, and deploy a full-stack application using modern JavaScript frameworks and industry-standard practices. TeachNotes addresses a real-world need for educators while showcasing skills in React, Node.js, Express, MongoDB, authentication, state management, and responsive design.
