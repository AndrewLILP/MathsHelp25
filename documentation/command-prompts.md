Libraries and Command Prompts

Front End (React) - Call it FrontEnd
# Create a new React application
npx create-react-app teachnotes-frontend
cd teachnotes-frontend

# Install key dependencies
npm install react-router-dom axios jwt-decode tailwindcss
npm install @headlessui/react @heroicons/react
npm install react-quill  # Rich text editor
npm install react-hot-toast  # Notifications

# Set up Tailwind CSS
npx tailwindcss init -p

# Start development server
npm start

# When ready to deploy
npm run build


Backend Setup (Node.js/Express) - call it BackEnd

# Create a new Node.js project
mkdir teachnotes-backend // actually called MathsHelp25
cd teachnotes-backend
npm init -y

# Install core dependencies
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
npm install multer  # For file uploads
npm install morgan  # For logging
npm install helmet  # For security headers

# Install development dependencies
npm install nodemon --save-dev

# Create basic server file
touch server.js

# Create environment variables file
touch .env

# Run the server in development mode
npx nodemon server.js

MongoDB Atlas Setup
.env template
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/teachnotes?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
PORT=5000