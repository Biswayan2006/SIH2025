const { Router } = require('express')
const { Bus, Route, Feedback, User } = require('../models')

const router = Router()

// Get overview statistics for admin dashboard
router.get('/overview', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query
    
    const totalBuses = await Bus.countDocuments({})
    const activeBuses = await Bus.countDocuments({ status: 'active' })
    const totalRoutes = await Route.countDocuments({ isActive: true })
    
    // Calculate average delay
    const delayStats = await Bus.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          avgDelay: { $avg: '$delay' },
          totalPassengers: { $sum: '$currentPassengers' }
        }
      }
    ])
    
    const avgDelay = delayStats[0]?.avgDelay || 0
    const totalPassengers = delayStats[0]?.totalPassengers || 0
    
    // Get CO2 savings from green score
    const co2Stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$greenScore.totalCO2Saved' }
        }
      }
    ])
    
    const co2Saved = co2Stats[0]?.totalCO2Saved || 0
    
    res.json({
      success: true,
      data: {
        totalBuses,
        activeBuses,
        totalRoutes,
        avgDelay: Math.round(avgDelay * 10) / 10,
        totalPassengers,
        co2Saved: Math.round(co2Saved * 10) / 10,
        timeRange
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching overview statistics',
      error: error.message
    })
  }
})

// Get route performance analytics
router.get('/routes/performance', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true })
    
    const performance = await Promise.all(
      routes.map(async (route) => {
        // Get buses on this route
        const buses = await Bus.find({ route: route.routeId })
        
        // Calculate metrics
        const totalBuses = buses.length
        const activeBuses = buses.filter(b => b.status === 'active').length
        const avgDelay = buses.reduce((sum, b) => sum + b.delay, 0) / totalBuses || 0
        const totalPassengers = buses.reduce((sum, b) => sum + b.currentPassengers, 0)
        const totalCapacity = buses.reduce((sum, b) => sum + b.capacity, 0)
        
        // Calculate popularity (usage percentage)
        const popularity = totalCapacity > 0 ? (totalPassengers / totalCapacity) * 100 : 0
        
        // Calculate efficiency (inverse of delay, normalized to 0-100)
        const efficiency = Math.max(0, 100 - (avgDelay * 10))
        
        return {
          routeId: route.routeId,
          name: route.name,
          totalBuses,
          activeBuses,
          avgDelay: Math.round(avgDelay * 10) / 10,
          popularity: Math.round(popularity),
          efficiency: Math.round(efficiency),
          passengers: totalPassengers,
          capacity: totalCapacity
        }
      })
    )
    
    res.json({
      success: true,
      data: performance
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching route performance',
      error: error.message
    })
  }
})

// Get feedback analytics
router.get('/feedback/summary', async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }
    
    // Get feedback counts by type
    const typeStats = await Feedback.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgUpvotes: { $avg: '$upvotes' }
        }
      }
    ])
    
    // Get previous period for trend calculation
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - (now.getDate() - startDate.getDate()))
    
    const prevTypeStats = await Feedback.aggregate([
      { $match: { createdAt: { $gte: prevStartDate, $lt: startDate } } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ])
    
    // Calculate trends
    const summary = typeStats.map(stat => {
      const prevStat = prevTypeStats.find(p => p._id === stat._id)
      const prevCount = prevStat?.count || 0
      const change = stat.count - prevCount
      const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      
      return {
        type: stat._id,
        count: stat.count,
        avgUpvotes: Math.round(stat.avgUpvotes * 10) / 10,
        trend,
        change: Math.abs(change)
      }
    })
    
    res.json({
      success: true,
      data: summary,
      timeRange
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback summary',
      error: error.message
    })
  }
})

// Get real-time fleet status
router.get('/fleet/status', async (req, res) => {
  try {
    const buses = await Bus.find().populate('route')
    
    const fleetStatus = {
      active: buses.filter(b => b.status === 'active').length,
      maintenance: buses.filter(b => b.status === 'maintenance').length,
      offline: buses.filter(b => b.status === 'offline').length,
      total: buses.length
    }
    
    // Get buses with high delays (>5 minutes)
    const delayedBuses = buses.filter(b => b.delay > 5)
    
    // Get overcrowded buses (>80% capacity)
    const overcrowdedBuses = buses.filter(b => 
      b.currentPassengers / b.capacity > 0.8
    )
    
    res.json({
      success: true,
      data: {
        fleetStatus,
        alerts: {
          delayedBuses: delayedBuses.length,
          overcrowdedBuses: overcrowdedBuses.length
        },
        details: {
          delayed: delayedBuses.map(b => ({
            busId: b.busId,
            route: b.route,
            delay: b.delay
          })),
          overcrowded: overcrowdedBuses.map(b => ({
            busId: b.busId,
            route: b.route,
            occupancy: Math.round((b.currentPassengers / b.capacity) * 100)
          }))
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fleet status',
      error: error.message
    })
  }
})

// Get usage patterns (hourly/daily)
router.get('/usage/patterns', async (req, res) => {
  try {
    const { period = 'hourly' } = req.query
    
    let groupBy
    if (period === 'hourly') {
      groupBy = {
        hour: { $hour: '$createdAt' },
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      }
    } else {
      groupBy = {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
      }
    }
    
    // This would typically use trip/journey data, but we'll simulate with feedback data
    const patterns = await Feedback.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1, '_id.hour': 1 } }
    ])
    
    res.json({
      success: true,
      data: patterns,
      period
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage patterns',
      error: error.message
    })
  }
})

module.exports = router