const { Router } = require('express')
const { passport, generateToken, verifyToken } = require('../config/passport')
const { User } = require('../models')
const router = Router()

// Traditional login (placeholder)
router.post('/login', (req, res) => {
  res.json({ ok: true, message: 'Login placeholder' })
})


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

>>>>>>> 057b14ebc850bae2c148969af3a91599e5e99f95
module.exports = router


