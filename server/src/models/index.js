const mongoose = require('mongoose')

// Bus Schema
const busSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true },
  route: { type: String, required: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  status: { 
    type: String, 
    enum: ['active', 'maintenance', 'offline'], 
    default: 'active' 
  },
  capacity: { type: Number, required: true },
  currentPassengers: { type: Number, default: 0 },
  driver: {
    name: String,
    id: String,
    contact: String
  },
  speed: { type: Number, default: 0 },
  delay: { type: Number, default: 0 }, // in minutes
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true })

// Route Schema
const routeSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  stops: [{
    name: String,
    location: {
      lat: Number,
      lng: Number
    },
    sequence: Number
  }],
  path: [{
    lat: Number,
    lng: Number
  }],
  schedule: {
    weekdays: [String],
    weekends: [String]
  },
  fare: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  frequency: { type: Number, required: true }, // in minutes
  type: {
    type: String,
    enum: ['express', 'regular', 'night', 'campus'],
    default: 'regular'
  },
  features: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['issue', 'suggestion', 'rating', 'compliment'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  route: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['submitted', 'investigating', 'under-review', 'resolved', 'acknowledged'],
    default: 'submitted'
  },
  author: {
    name: String,
    email: String,
    isAnonymous: { type: Boolean, default: true }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  upvotes: { type: Number, default: 0 },
  responses: [{
    message: String,
    author: String,
    timestamp: { type: Date, default: Date.now }
  }],
  metadata: {
    location: {
      lat: Number,
      lng: Number
    },
    timestamp: { type: Date, default: Date.now },
    device: String,
    userAgent: String
  }
}, { timestamps: true })

// User/Green Score Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  greenScore: {
    totalCO2Saved: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    totalDistance: { type: Number, default: 0 },
    totalMoneySaved: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    achievements: [{
      id: String,
      name: String,
      unlockedAt: Date
    }],
    monthlyStats: [{
      month: String,
      year: Number,
      co2Saved: Number,
      trips: Number,
      distance: Number,
      moneySaved: Number
    }]
  },
  trips: [{
    date: Date,
    route: String,
    from: String,
    to: String,
    distance: Number,
    co2Saved: Number,
    moneySaved: Number
  }],
  preferences: {
    language: { type: String, default: 'en' },
    accessibility: {
      largeText: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      voiceAnnouncements: { type: Boolean, default: false },
      reduceMotion: { type: Boolean, default: false }
    },
    notifications: {
      delays: { type: Boolean, default: true },
      newRoutes: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true }
    }
  }
}, { timestamps: true })

// Analytics Schema
const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ['daily', 'hourly'],
    required: true
  },
  data: {
    totalPassengers: Number,
    totalTrips: Number,
    avgDelay: Number,
    co2Saved: Number,
    routePerformance: [{
      routeId: String,
      passengers: Number,
      trips: Number,
      avgDelay: Number,
      efficiency: Number
    }],
    busPerformance: [{
      busId: String,
      trips: Number,
      passengers: Number,
      avgDelay: Number,
      maintenanceHours: Number
    }]
  }
}, { timestamps: true })

// Notifications Schema
const notificationSchema = new mongoose.Schema({
  notificationId: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['delay', 'cancellation', 'route_change', 'announcement', 'maintenance'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  route: String, // Optional - for route-specific notifications
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'route_users', 'admins'],
    default: 'all'
  },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  metadata: {
    createdBy: String,
    affectedRoutes: [String],
    estimatedDuration: Number // in minutes
  }
}, { timestamps: true })

// Maintenance Schema
const maintenanceSchema = new mongoose.Schema({
  maintenanceId: { type: String, required: true, unique: true },
  busId: { type: String, required: true },
  type: {
    type: String,
    enum: ['routine', 'repair', 'inspection', 'cleaning', 'emergency', 'upgrade'],
    required: true
  },
  title: String,
  description: String,
  scheduledDate: { type: Date, required: true },
  completedDate: Date,
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  cost: Number,
  estimatedDuration: Number, // in hours
  actualDuration: Number, // in hours
  technician: {
    name: String,
    id: String,
    contact: String,
    specialization: String
  },
  parts: [{
    name: String,
    cost: Number,
    quantity: Number,
    supplier: String
  }],
  notes: String,
  images: [String], // URLs to maintenance images
  warranty: {
    covered: { type: Boolean, default: false },
    expiryDate: Date,
    provider: String
  }
}, { timestamps: true })

module.exports = {
  Bus: mongoose.model('Bus', busSchema),
  Route: mongoose.model('Route', routeSchema),
  Feedback: mongoose.model('Feedback', feedbackSchema),
  User: mongoose.model('User', userSchema),
  Analytics: mongoose.model('Analytics', analyticsSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  Maintenance: mongoose.model('Maintenance', maintenanceSchema)
}