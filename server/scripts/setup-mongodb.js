/**
 * MongoDB Setup Helper Script
 * 
 * This script helps verify MongoDB connection and creates initial collections
 * Run with: node scripts/setup-mongodb.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sih2025';

console.log('🔄 Attempting to connect to MongoDB...');
console.log(`🔗 Connection URI: ${MONGO_URI}`);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('✅ MongoDB connected successfully!');
  
  // Load models
  const models = require('../src/models');
  
  // Check if User collection exists and has documents
  const userCount = await models.User.countDocuments();
  console.log(`ℹ️ Found ${userCount} users in database`);
  
  if (userCount === 0) {
    console.log('🔄 Creating sample user...');
    
    // Create a sample user
    const sampleUser = new models.User({
      name: 'Sample User',
      email: 'sample@example.com',
      userId: uuidv4(),
      greenScore: {
        totalCO2Saved: 0,
        level: 1,
        points: 0
      },
      trips: [],
      preferences: {
        theme: 'light',
        notifications: true
      }
    });
    
    await sampleUser.save();
    console.log('✅ Sample user created successfully!');
  }
  
  console.log('\n📋 MongoDB Setup Summary:');
  console.log('- Connection: ✅ Successful');
  console.log(`- Database: ${mongoose.connection.db.databaseName}`);
  console.log(`- Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  
  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('- Collections:');
  collections.forEach(collection => {
    console.log(`  - ${collection.name}`);
  });
  
  console.log('\n🎉 MongoDB setup complete! Your database is ready to use.');
  console.log('👉 You can now start your application with: npm start');
  
  // Close connection
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('\n🔍 Troubleshooting tips:');
  console.log('1. Make sure MongoDB is installed and running');
  console.log('2. Check if the MongoDB URI is correct in your .env file');
  console.log('3. For local MongoDB, ensure the service is running with: mongod --version');
  console.log('4. For MongoDB Atlas, verify your network allows the connection');
  console.log('\n📥 Installation instructions:');
  console.log('- Windows: https://www.mongodb.com/try/download/community');
  console.log('- macOS: brew install mongodb-community');
  console.log('- Linux: https://www.mongodb.com/docs/manual/administration/install-on-linux/');
  
  process.exit(1);
});