const { Router } = require('express')
const { Bus, Route } = require('../models')
const router = Router()

// Get all buses with real-time data
router.get('/', async (req, res) => {
  try {
    const { status, route } = req.query
    
    let filter = {}
    if (status) filter.status = status
    if (route) filter.route = route
    
    const buses = await Bus.find(filter).sort({ lastUpdated: -1 })
    
    res.json({
      success: true,
      data: buses,
      count: buses.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buses',
      error: error.message
    })
  }
})

// Get specific bus by ID
router.get('/:busId', async (req, res) => {
  try {
    const bus = await Bus.findOne({ busId: req.params.busId })
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      })
    }
    
    res.json({
      success: true,
      data: bus
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bus',
      error: error.message
    })
  }
})

// Update bus location and status
router.put('/:busId/location', async (req, res) => {
  try {
    const { lat, lng, passengers, speed, delay } = req.body
    
    const bus = await Bus.findOneAndUpdate(
      { busId: req.params.busId },
      {
        currentLocation: { lat, lng },
        currentPassengers: passengers,
        speed,
        delay,
        lastUpdated: new Date()
      },
      { new: true }
    )
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      })
    }
    
    // Emit real-time update via Socket.IO
    req.io.emit('busLocationUpdate', {
      busId: bus.busId,
      location: bus.currentLocation,
      passengers: bus.currentPassengers,
      speed: bus.speed,
      delay: bus.delay
    })
    
    res.json({
      success: true,
      data: bus
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bus location',
      error: error.message
    })
  }
})

module.exports = router