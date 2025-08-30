const { Router } = require('express')
const router = Router()

// Placeholder for future Google OAuth
router.post('/login', (req, res) => {
  res.json({ ok: true, message: 'Login placeholder' })
})

module.exports = router


