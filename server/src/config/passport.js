const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

// Ensure environment variables are loaded
dotenv.config()

// Debug OAuth configuration
console.log('🔍 Debugging OAuth configuration:')
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID)
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET)
if (process.env.GOOGLE_CLIENT_ID) {
  console.log('CLIENT_ID length:', process.env.GOOGLE_CLIENT_ID.length)
}
if (process.env.GOOGLE_CLIENT_SECRET) {
  console.log('CLIENT_SECRET length:', process.env.GOOGLE_CLIENT_SECRET.length)
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('✅ Configuring Google OAuth strategy')
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in database
      let existingUser = await User.findOne({ userId: profile.id })
      
      if (existingUser) {
        // User exists, return the user
        console.log('🔍 Existing user found:', existingUser.name)
        return done(null, existingUser)
      }
      
      // Create new user
      console.log('➕ Creating new user from Google profile')
      const newUser = new User({
        userId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        greenScore: {
          totalCO2Saved: 0,
          totalTrips: 0,
          totalDistance: 0,
          totalMoneySaved: 0,
          level: 1,
          achievements: [],
          monthlyStats: []
        },
        trips: [],
        preferences: {
          language: 'en',
          accessibility: {
            largeText: false,
            highContrast: false,
            voiceAnnouncements: false,
            reduceMotion: false
          },
          notifications: {
            delays: true,
            newRoutes: true,
            achievements: true
          }
        }
      })
      
      await newUser.save()
      console.log('✅ New user created successfully')
      return done(null, newUser)
      
    } catch (error) {
      console.error('❌ Error in Google OAuth callback:', error)
      return done(error, null)
    }
  }))
} else {
  console.warn('⚠️ Google OAuth not configured. Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET')
}

// Generate JWT token for user
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.userId, 
      email: user.email, 
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    })
  }
}

module.exports = {
  passport,
  generateToken,
  verifyToken
}