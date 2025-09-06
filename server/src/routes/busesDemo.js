const { Router } = require('express')
const router = Router()

// Demo bus data
const demoBuses = [
  {
    busId: 'B-12A-01',
    route: '12A',
    currentLocation: { lat: 28.6139, lng: 77.2090 },
    status: 'active',
    capacity: 45,
    currentPassengers: 28,
    delay: 2,
    speed: 35,
    driver: { name: 'John Doe', id: 'D001', contact: '+91-9876543210' },
    lastUpdated: new Date()
  },
  {
    busId: 'B-12A-02',
    route: '12A',
    currentLocation: { lat: 28.5945, lng: 77.1532 },
    status: 'active',
    capacity: 45,
    currentPassengers: 35,
    delay: -1,
    speed: 40,
    driver: { name: 'Jane Smith', id: 'D002', contact: '+91-9876543211' },
    lastUpdated: new Date()
  },
  {
    busId: 'B-24X-01',
    route: '24X',
    currentLocation: { lat: 28.6239, lng: 77.2190 },
    status: 'active',
    capacity: 50,
    currentPassengers: 42,
    delay: 0,
    speed: 30,
    driver: { name: 'Mike Johnson', id: 'D003', contact: '+91-9876543212' },
    lastUpdated: new Date()
  },
  {
    busId: 'B-36C-01',
    route: '36C',
    currentLocation: { lat: 28.6339, lng: 77.1990 },
    status: 'maintenance',
    capacity: 40,
    currentPassengers: 0,
    delay: 0,
    speed: 0,
    driver: { name: '', id: '', contact: '' },
    lastUpdated: new Date()
  },
  {
    busId: 'B-15D-01',
    route: '15D',
    currentLocation: { lat: 28.6089, lng: 77.2150 },
    status: 'active',
    capacity: 35,
    currentPassengers: 15,
    delay: 5,
    speed: 25,
    driver: { name: 'Sarah Wilson', id: 'D004', contact: '+91-9876543213' },
    lastUpdated: new Date()
  },
  {
    busId: 'B-08B-01',
    route: '08B',
    currentLocation: { lat: 28.6189, lng: 77.2090 },
    status: 'offline',
    capacity: 45,
    currentPassengers: 0,
    delay: 0,
    speed: 0,
    driver: { name: '', id: '', contact: '' },
    lastUpdated: new Date()
  }
]

// Get all buses with demo data
router.get('/', async (req, res) => {
  try {
    const { status, route } = req.query
    
    let filteredBuses = [...demoBuses]
    
    if (status) {
      filteredBuses = filteredBuses.filter(bus => bus.status === status)
    }
    
    if (route) {
      filteredBuses = filteredBuses.filter(bus => bus.route === route)
    }
    
    res.json({
      success: true,
      data: filteredBuses,
      count: filteredBuses.length,
      note: 'Demo data - MongoDB not connected'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching demo buses',
      error: error.message
    })
  }
})

// Get specific bus by ID (demo)
router.get('/:busId', async (req, res) => {
  try {
    const bus = demoBuses.find(b => b.busId === req.params.busId)
    
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      })
    }
    
    res.json({
      success: true,
      data: bus,
      note: 'Demo data - MongoDB not connected'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching demo bus',
      error: error.message
    })
  }
})

// Update bus location (demo - just returns success)
router.put('/:busId/location', async (req, res) => {
  try {
    const { lat, lng, passengers, speed, delay } = req.body
    
    const busIndex = demoBuses.findIndex(b => b.busId === req.params.busId)
    
    if (busIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      })
    }
    
    // Update demo data
    demoBuses[busIndex] = {
      ...demoBuses[busIndex],
      currentLocation: { lat, lng },
      currentPassengers: passengers || demoBuses[busIndex].currentPassengers,
      speed: speed || demoBuses[busIndex].speed,
      delay: delay || demoBuses[busIndex].delay,
      lastUpdated: new Date()
    }
    
    // Emit real-time update via Socket.IO
    if (req.io) {
      req.io.emit('busLocationUpdate', {
        busId: demoBuses[busIndex].busId,
        location: demoBuses[busIndex].currentLocation,
        passengers: demoBuses[busIndex].currentPassengers,
        speed: demoBuses[busIndex].speed,
        delay: demoBuses[busIndex].delay
      })
    }
    
    res.json({
      success: true,
      data: demoBuses[busIndex],
      note: 'Demo data updated - MongoDB not connected'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating demo bus location',
      error: error.message
    })
  }
})

module.exports = router