const { Router } = require('express')
const { passport, generateToken, verifyToken } = require('../config/passport')
const { User } = require('../models')
const router = Router()

// Traditional signup (signup endpoint)
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const newUser = new User({
      userId,
      name: fullName,
      email,
      phone,
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
    });
    
    await newUser.save();
    
    // Generate JWT token
    const token = generateToken({ userId, name: fullName, email });
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        userId,
        name: fullName,
        email,
        phone,
        greenScore: newUser.greenScore
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during signup'
    });
  }
});

// Traditional login (placeholder)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // In a real application, you would hash and compare passwords
    // For demo purposes, we'll accept any password
    
    // Generate JWT token
    const token = generateToken({ userId: user.userId, name: user.name, email: user.email });
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        greenScore: user.greenScore
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});


// Test endpoint to check Google OAuth configuration
router.get('/test-oauth-config', (req, res) => {
  res.json({
    googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    expectedCallbackUrl: 'http://localhost:4001/api/auth/google/callback',
    frontendUrl: process.env.FRONTEND_URL,
    message: 'OAuth configuration check'
  });
});


// Google OAuth Routes

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  console.log('🚀 Starting Google OAuth flow')
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Google OAuth not configured')
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=google_oauth_not_configured`)
  }
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'  // Force account picker
  })(req, res, next)
})

// Google OAuth callback
router.get('/google/callback', 
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('❌ OAuth authentication error:', err)
        const errorMsg = encodeURIComponent(err.message || 'authentication_error')
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/success?error=${errorMsg}`)
      }
      
      if (!user) {
        console.error('❌ No user returned from Google OAuth:', info)
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/success?error=authentication_failed`)
      }

      try {
        // Generate JWT token
        const token = generateToken(user)
        console.log('✅ JWT token generated successfully')
        
        // Encode user data to pass in URL
        const encodedUser = encodeURIComponent(JSON.stringify({
          name: user.name,
          email: user.email,
          userId: user.userId
        }))
        
        // Redirect to frontend with token and user data
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'
        console.log('🔗 Redirecting to:', frontendUrl + '/auth/success')
        res.redirect(`${frontendUrl}/auth/success?token=${token}&user=${encodedUser}`)
      } catch (error) {
        console.error('❌ Token generation error:', error)
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/auth/success?error=token_generation_failed`)
      }
    })(req, res, next)
  }
)

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error logging out' 
      })
    }
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
  })
})

// Get current user (protected route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId })
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      })
    }
    
    res.json({ 
      success: true, 
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        greenScore: user.greenScore,
        preferences: user.preferences
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user data' 
    })
  }
})

// Verify token endpoint
router.post('/verify-token', verifyToken, (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  })
})

module.exports = router


