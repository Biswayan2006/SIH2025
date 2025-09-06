# SIH2025 Project

This project consists of a React frontend and Node.js backend with Google OAuth authentication.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google OAuth credentials

### MongoDB Setup

1. **Install MongoDB Community Edition**:
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow the installation instructions for your operating system
   - Start the MongoDB service

2. **Alternative: Use MongoDB Atlas**:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Create a new cluster
   - Get your connection string and update it in the server's `.env` file

3. **Verify your MongoDB connection**:
   ```
   cd server
   npm run setup-db
   ```
   This script will check your connection, create a sample user if none exists, and provide troubleshooting tips if there are connection issues.

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Navigate to "APIs & Services" > "Credentials"
4. Create OAuth client ID credentials
5. Set the authorized redirect URI to: `http://localhost:4001/api/auth/google/callback`
6. Copy the Client ID and Client Secret to the server's `.env` file

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if available) or create a new `.env` file
   - Update the following variables:
     ```
     PORT=4001
     MONGO_URI=mongodb://localhost:27017/sih2025
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     JWT_SECRET=your-jwt-secret-key
     SESSION_SECRET=your-session-secret-key
     FRONTEND_URL=http://localhost:3000
     ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd SIH2025
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file with the following content:
     ```
     VITE_API_URL=http://localhost:4001
     ```

4. Start the development server:
   ```
   npm run dev
   ```

## Authentication Flow

1. User clicks "Continue with Google" on the login page
2. User is redirected to Google's authentication page
3. After successful authentication, Google redirects back to the backend
4. Backend creates/updates the user and generates a JWT token
5. User is redirected to the frontend with the token
6. Frontend stores the token and user data in context/local storage
7. User is now authenticated and redirected to the home page

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or your Atlas connection string is correct
- Check if the MongoDB port is accessible (default: 27017)
- The application will run in demo mode if MongoDB connection fails

### Google OAuth Issues

- Verify that your Google OAuth credentials are correct
- Ensure the redirect URI in Google Cloud Console matches your backend callback URL
- Check that your frontend and backend URLs are correctly set in the `.env` files