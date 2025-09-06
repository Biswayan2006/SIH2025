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
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5176'}/login?error=google_oauth_not_configured`)
  }
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })(req, res, next)
})

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login?error=oauth_failed' }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = generateToken(req.user)
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5176'
      res.redirect(`${frontendUrl}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        name: req.user.name,
        email: req.user.email,
        userId: req.user.userId
      }))}`)
    } catch (error) {
      console.error('Error in OAuth callback:', error)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5176'}/login?error=token_generation_failed`)
    }
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


