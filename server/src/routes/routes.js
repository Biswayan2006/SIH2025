const { Router } = require('express')
const { Route, Bus } = require('../models')
const router = Router()

// Get all routes
router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query
    
    let filter = { isActive: true }
    if (type) filter.type = type
    
    let routes = await Route.find(filter)
    
    if (search) {
      const searchRegex = new RegExp(search, 'i')
      routes = routes.filter(route => 
        searchRegex.test(route.routeId) ||
        searchRegex.test(route.name) ||
        searchRegex.test(route.from) ||
        searchRegex.test(route.to)
      )
    }
    
    res.json({
      success: true,
      data: routes,
      count: routes.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    })
  }
})

// Get specific route
router.get('/:routeId', async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.routeId })
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      })
    }
    
    // Get buses on this route
    const buses = await Bus.find({ route: req.params.routeId, status: 'active' })
    
    res.json({
      success: true,
      data: {
        ...route.toObject(),
        activeBuses: buses
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching route',
      error: error.message
    })
  }
})

// Get ETA for a stop on a route
router.get('/:routeId/eta/:stopName', async (req, res) => {
  try {
    const { routeId, stopName } = req.params
    
    // Find active buses on this route
    const buses = await Bus.find({ 
      route: routeId, 
      status: 'active' 
    }).sort({ delay: 1 })
    
    // Calculate ETA based on bus positions and delays
    const etaCalculations = buses.map(bus => {
      const baseETA = Math.random() * 15 + 5 // 5-20 minutes base
      const adjustedETA = baseETA + bus.delay
      
      return {
        busId: bus.busId,
        eta: Math.max(1, Math.round(adjustedETA)),
        crowdLevel: bus.currentPassengers / bus.capacity > 0.8 ? 'high' : 
                   bus.currentPassengers / bus.capacity > 0.5 ? 'medium' : 'low'
      }
    })
    
    res.json({
      success: true,
      data: {
        stop: stopName,
        route: routeId,
        arrivals: etaCalculations
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating ETA',
      error: error.message
    })
  }
})

module.exports = router


