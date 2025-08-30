const { Router } = require('express')
const { User } = require('../models')

const router = Router()

// Get user's green score data
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    
    res.json({
      success: true,
      data: user.greenScore
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching green score',
      error: error.message
    })
  }
})

// Record a new trip and update green score
router.post('/user/:userId/trip', async (req, res) => {
  try {
    const { route, from, to, distance } = req.body
    
    // Calculate CO2 savings (approx 2.3 kg CO2 per liter of fuel, 8 km/l efficiency)
    // Public transport saves about 0.17 kg CO2 per km compared to private vehicle
    const co2Saved = distance * 0.17
    
    // Calculate money saved (assuming Rs.8 per km for private transport vs Rs.2 per km for public)
    const moneySaved = distance * 6
    
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $push: {
          trips: {
            date: new Date(),
            route,
            from,
            to,
            distance,
            co2Saved,
            moneySaved
          }
        },
        $inc: {
          'greenScore.totalCO2Saved': co2Saved,
          'greenScore.totalTrips': 1,
          'greenScore.totalDistance': distance,
          'greenScore.totalMoneySaved': moneySaved
        }
      },
      { new: true, upsert: true }
    )
    
    // Check for level up
    const newLevel = calculateLevel(user.greenScore.totalCO2Saved)
    if (newLevel > user.greenScore.level) {
      await User.findOneAndUpdate(
        { userId: req.params.userId },
        { 'greenScore.level': newLevel }
      )
    }
    
    res.json({
      success: true,
      message: 'Trip recorded successfully',
      data: {
        co2Saved,
        moneySaved,
        newLevel: newLevel > user.greenScore.level ? newLevel : null
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording trip',
      error: error.message
    })
  }
})

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query
    
    let matchCondition = {}
    if (period === 'month') {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)
      
      matchCondition = {
        'trips.date': { $gte: startOfMonth }
      }
    }
    
    const leaderboard = await User.aggregate([
      { $match: matchCondition },
      {
        $project: {
          userId: 1,
          name: 1,
          'greenScore.totalCO2Saved': 1,
          'greenScore.totalTrips': 1,
          'greenScore.level': 1
        }
      },
      { $sort: { 'greenScore.totalCO2Saved': -1 } },
      { $limit: parseInt(limit) }
    ])
    
    res.json({
      success: true,
      data: leaderboard.map((user, index) => ({
        rank: index + 1,
        ...user
      }))
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    })
  }
})

// Unlock achievement
router.post('/user/:userId/achievement', async (req, res) => {
  try {
    const { achievementId, name } = req.body
    
    const user = await User.findOneAndUpdate(
      { 
        userId: req.params.userId,
        'greenScore.achievements.id': { $ne: achievementId }
      },
      {
        $push: {
          'greenScore.achievements': {
            id: achievementId,
            name,
            unlockedAt: new Date()
          }
        }
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Achievement already unlocked or user not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Achievement unlocked!',
      data: {
        achievement: { id: achievementId, name },
        totalAchievements: user.greenScore.achievements.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unlocking achievement',
      error: error.message
    })
  }
})

// Get environmental impact statistics
router.get('/impact/global', async (req, res) => {
  try {
    const globalStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$greenScore.totalCO2Saved' },
          totalTrips: { $sum: '$greenScore.totalTrips' },
          totalUsers: { $sum: 1 },
          totalDistance: { $sum: '$greenScore.totalDistance' },
          totalMoneySaved: { $sum: '$greenScore.totalMoneySaved' }
        }
      }
    ])
    
    const stats = globalStats[0] || {
      totalCO2Saved: 0,
      totalTrips: 0,
      totalUsers: 0,
      totalDistance: 0,
      totalMoneySaved: 0
    }
    
    // Calculate equivalent metrics
    const treesEquivalent = stats.totalCO2Saved / 22 // 1 tree absorbs ~22kg CO2/year
    const carsOffRoad = stats.totalCO2Saved / 4600 // Average car emits 4.6 tons CO2/year
    
    res.json({
      success: true,
      data: {
        ...stats,
        treesEquivalent: Math.round(treesEquivalent * 10) / 10,
        carsOffRoad: Math.round(carsOffRoad * 10) / 10
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching global impact',
      error: error.message
    })
  }
})

// Helper function to calculate level based on CO2 saved
function calculateLevel(co2Saved) {
  if (co2Saved < 20) return 1
  if (co2Saved < 50) return 2
  if (co2Saved < 100) return 3
  if (co2Saved < 200) return 4
  if (co2Saved < 350) return 5
  if (co2Saved < 500) return 6
  if (co2Saved < 750) return 7
  return 8
}

module.exports = router