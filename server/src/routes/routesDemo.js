const { Router } = require('express')
const router = Router()

// Mock data for demo purposes
const demoRoutes = [
  {
    routeId: '12A',
    name: 'City Center Express',
    from: 'Airport Terminal',
    to: 'Central Station',
    stops: [
      { name: 'Airport Terminal', location: { lat: 28.5665, lng: 77.1031 }, sequence: 1 },
      { name: 'Metro Junction', location: { lat: 28.5945, lng: 77.1532 }, sequence: 2 },
      { name: 'Mall Plaza', location: { lat: 28.6139, lng: 77.2090 }, sequence: 3 },
      { name: 'Central Station', location: { lat: 28.6419, lng: 77.2219 }, sequence: 4 }
    ],
    path: [
      { lat: 28.5665, lng: 77.1031 },
      { lat: 28.5945, lng: 77.1532 },
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.6419, lng: 77.2219 }
    ],
    schedule: {
      weekdays: ['06:00', '06:15', '06:30', '06:45', '07:00', '07:15', '07:30', '08:00'],
      weekends: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30']
    },
    fare: 25,
    duration: 45,
    frequency: 15,
    type: 'express',
    features: ['AC', 'WiFi', 'GPS'],
    isActive: true
  },
  {
    routeId: '24X',
    name: 'Tech Park Shuttle',
    from: 'University Gate',
    to: 'Tech Park',
    stops: [
      { name: 'University Gate', location: { lat: 28.6089, lng: 77.2150 }, sequence: 1 },
      { name: 'Student Housing', location: { lat: 28.6189, lng: 77.2250 }, sequence: 2 },
      { name: 'Shopping Center', location: { lat: 28.6289, lng: 77.2350 }, sequence: 3 },
      { name: 'Tech Park', location: { lat: 28.6389, lng: 77.2450 }, sequence: 4 }
    ],
    path: [
      { lat: 28.6089, lng: 77.2150 },
      { lat: 28.6189, lng: 77.2250 },
      { lat: 28.6289, lng: 77.2350 },
      { lat: 28.6389, lng: 77.2450 }
    ],
    schedule: {
      weekdays: ['05:45', '06:00', '06:15', '06:30', '06:45', '07:00', '07:15'],
      weekends: ['07:00', '07:30', '08:00', '08:30', '09:00']
    },
    fare: 20,
    duration: 35,
    frequency: 15,
    type: 'regular',
    features: ['AC', 'GPS'],
    isActive: true
  },
  {
    routeId: '36C',
    name: 'Mall Circuit',
    from: 'Central Station',
    to: 'Shopping Mall',
    stops: [
      { name: 'Central Station', location: { lat: 28.6419, lng: 77.2219 }, sequence: 1 },
      { name: 'Business District', location: { lat: 28.6339, lng: 77.1990 }, sequence: 2 },
      { name: 'Shopping Mall', location: { lat: 28.6239, lng: 77.1890 }, sequence: 3 }
    ],
    path: [
      { lat: 28.6419, lng: 77.2219 },
      { lat: 28.6339, lng: 77.1990 },
      { lat: 28.6239, lng: 77.1890 }
    ],
    schedule: {
      weekdays: ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00'],
      weekends: ['08:00', '08:30', '09:00', '09:30', '10:00']
    },
    fare: 15,
    duration: 25,
    frequency: 12,
    type: 'regular',
    features: ['GPS'],
    isActive: true
  }
]

// Get all routes
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: demoRoutes,
    count: demoRoutes.length
  })
})

// Get specific route by ID
router.get('/:routeId', (req, res) => {
  const route = demoRoutes.find(r => r.routeId === req.params.routeId)
  
  if (!route) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    })
  }
  
  res.json({
    success: true,
    data: route
  })
})

// Search routes
router.get('/search/:query', (req, res) => {
  const query = req.params.query.toLowerCase()
  const filteredRoutes = demoRoutes.filter(route =>
    route.name.toLowerCase().includes(query) ||
    route.from.toLowerCase().includes(query) ||
    route.to.toLowerCase().includes(query) ||
    route.routeId.toLowerCase().includes(query) ||
    route.stops.some(stop => stop.name.toLowerCase().includes(query))
  )
  
  res.json({
    success: true,
    data: filteredRoutes,
    count: filteredRoutes.length
  })
})

module.exports = router