const { Router } = require('express')
<<<<<<< HEAD
const router = Router()

// Placeholder for future Google OAuth
=======
const { passport, generateToken, verifyToken } = require('../config/passport')
const { User } = require('../models')
const router = Router()

// Traditional login (placeholder)
>>>>>>> 057b14ebc850bae2c148969af3a91599e5e99f95
router.post('/login', (req, res) => {
  res.json({ ok: true, message: 'Login placeholder' })
})

<<<<<<< HEAD
=======
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
    passport.authenticate('google', { 
      failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=oauth_failed` 
    }, (err, user, info) => {
      if (err) {
        console.error('❌ OAuth authentication error:', err)
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=oauth_error&details=${encodeURIComponent(err.message)}`)
      }
      if (!user) {
        console.error('❌ OAuth authentication failed:', info)
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=oauth_no_user&details=${encodeURIComponent(info ? info.message : 'Unknown error')}`)
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('❌ Login error:', err)
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=login_failed`)
        }
        next()
      })
    })(req, res, next)
  },
  async (req, res) => {
    try {
      console.log('🔍 OAuth callback successful, user:', req.user ? req.user.name : 'No user')
      
      if (!req.user) {
        console.error('❌ No user found in OAuth callback')
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=no_user_data`)
      }
      
      // Generate JWT token
      const token = generateToken(req.user)
      console.log('✅ JWT token generated successfully')
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174'
      const redirectUrl = `${frontendUrl}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        name: req.user.name,
        email: req.user.email,
        userId: req.user.userId
      }))}`
      
      console.log('🔗 Redirecting to:', frontendUrl + '/auth/success')
      res.redirect(redirectUrl)
    } catch (error) {
      console.error('❌ Error in OAuth callback:', error)
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5174'}/login?error=token_generation_failed`)
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

>>>>>>> 057b14ebc850bae2c148969af3a91599e5e99f95
module.exports = router


