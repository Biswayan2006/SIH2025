const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const { Server } = require('socket.io')
const { Bus } = require('./models')
const { passport } = require('./config/passport')

dotenv.config()

const app = express()
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true
}))
app.use(express.json())

// Session configuration for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 4001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transittrack'

// Connect to MongoDB
let isMongoConnected = false;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    isMongoConnected = true;
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection failed, running with demo data:', err.message)
    isMongoConnected = false;
  })

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: isMongoConnected ? 'connected' : 'demo-mode'
  })
})

// Middleware to attach Socket.IO to requests
app.use((req, res, next) => {
  req.io = io
  next()
})

// API Routes
if (isMongoConnected) {
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/feedback', require('./routes/feedback'))
  app.use('/api/routes', require('./routes/routes'))
  app.use('/api/buses', require('./routes/buses'))
  app.use('/api/green-score', require('./routes/greenScore'))
  app.use('/api/analytics', require('./routes/analytics'))
} else {
  console.log('📋 Running in demo mode with mock data')
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/feedback', require('./routes/feedback'))
  app.use('/api/routes', require('./routes/routesDemo'))
  app.use('/api/buses', require('./routes/busesDemo'))
  app.use('/api/green-score', require('./routes/greenScore'))
  app.use('/api/analytics', require('./routes/analytics'))
}

// Create HTTP server and Socket.IO
const server = http.createServer(app)
const io = new Server(server, { 
  cors: { 
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
    methods: ['GET', 'POST']
  } 
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔗 Client connected:', socket.id)
  
  // Send welcome message
  socket.emit('welcome', { 
    message: 'Connected to TransitTrack real-time service',
    timestamp: new Date().toISOString()
  })
  
  // Handle bus location subscription
  socket.on('subscribeToBusUpdates', (routeId) => {
    if (routeId) {
      socket.join(`route_${routeId}`)
      console.log(`📍 Client subscribed to route ${routeId} updates`)
    } else {
      socket.join('all_buses')
      console.log('📍 Client subscribed to all bus updates')
    }
  })
  
  // Handle admin dashboard subscription
  socket.on('subscribeToAdminUpdates', () => {
    socket.join('admin_updates')
    console.log('🔧 Client subscribed to admin updates')
  })
  
  // Handle feedback updates subscription
  socket.on('subscribeToFeedback', () => {
    socket.join('feedback_updates')
    console.log('💬 Client subscribed to feedback updates')
  })
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id)
  })
})

// Simulate real-time bus updates (for demo purposes)
setInterval(async () => {
  try {
    if (isMongoConnected) {
      const buses = await Bus.find({ status: 'active' })
      
      for (const bus of buses) {
        // Simulate small location changes
        const latChange = (Math.random() - 0.5) * 0.001
        const lngChange = (Math.random() - 0.5) * 0.001
        
        const updatedBus = {
          busId: bus.busId,
          route: bus.route,
          location: {
            lat: bus.currentLocation.lat + latChange,
            lng: bus.currentLocation.lng + lngChange
          },
          passengers: Math.max(0, bus.currentPassengers + Math.floor((Math.random() - 0.5) * 3)),
          delay: Math.max(0, bus.delay + Math.floor((Math.random() - 0.5) * 2)),
          timestamp: new Date().toISOString()
        }
        
        // Update database
        await Bus.findOneAndUpdate(
          { busId: bus.busId },
          {
            currentLocation: updatedBus.location,
            currentPassengers: Math.min(updatedBus.passengers, bus.capacity),
            delay: updatedBus.delay,
            lastUpdated: new Date()
          }
        )
        
        // Emit to subscribers
        io.to(`route_${bus.route}`).emit('busLocationUpdate', updatedBus)
        io.to('all_buses').emit('busLocationUpdate', updatedBus)
        io.to('admin_updates').emit('fleetUpdate', updatedBus)
      }
    } else {
      // Demo mode - simulate updates for demo buses
      const demoBuses = [
        { busId: 'B-12A-01', route: '12A', lat: 28.6139, lng: 77.2090 },
        { busId: 'B-12A-02', route: '12A', lat: 28.5945, lng: 77.1532 },
        { busId: 'B-24X-01', route: '24X', lat: 28.6239, lng: 77.2190 }
      ]
      
      for (const bus of demoBuses) {
        const latChange = (Math.random() - 0.5) * 0.001
        const lngChange = (Math.random() - 0.5) * 0.001
        
        const updatedBus = {
          busId: bus.busId,
          route: bus.route,
          location: {
            lat: bus.lat + latChange,
            lng: bus.lng + lngChange
          },
          passengers: Math.floor(Math.random() * 50),
          delay: Math.floor(Math.random() * 10),
          timestamp: new Date().toISOString()
        }
        
        // Emit to subscribers
        io.to(`route_${bus.route}`).emit('busLocationUpdate', updatedBus)
        io.to('all_buses').emit('busLocationUpdate', updatedBus)
        io.to('admin_updates').emit('fleetUpdate', updatedBus)
      }
    }
  } catch (error) {
    console.error('Error in bus simulation:', error)
  }
}, 10000) // Update every 10 seconds

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  })
})

// Start server
server.listen(PORT, () => {
  console.log(`🚀 TransitTrack server running on port ${PORT}`)
  console.log(`🔗 Socket.IO enabled for real-time updates`)
  console.log(`🗺️ API available at http://localhost:${PORT}/api`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛡️ SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('🚫 Process terminated')
    mongoose.connection.close()
  })
})