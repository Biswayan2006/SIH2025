const mongoose = require('mongoose')
const { Bus, Route, Feedback, User } = require('./models')

const seedData = async () => {
  try {
    console.log('🌱 Seeding database with sample data...')
    
    // Clear existing data
    await Bus.deleteMany({})
    await Route.deleteMany({})
    await Feedback.deleteMany({})
    await User.deleteMany({})
    
    // Sample Routes
    const routes = [
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
    
    await Route.insertMany(routes)
    console.log('✅ Routes seeded successfully')
    
    // Sample Buses
    const buses = [
      {
        busId: 'B-12A-01',
        route: '12A',
        currentLocation: { lat: 28.6139, lng: 77.2090 },
        status: 'active',
        capacity: 45,
        currentPassengers: 28,
        driver: { name: 'John Doe', id: 'D001', contact: '+91-9876543210' },
        speed: 25,
        delay: 2
      },
      {
        busId: 'B-12A-02',
        route: '12A',
        currentLocation: { lat: 28.5945, lng: 77.1532 },
        status: 'active',
        capacity: 45,
        currentPassengers: 35,
        driver: { name: 'Jane Smith', id: 'D002', contact: '+91-9876543211' },
        speed: 30,
        delay: -1
      },
      {
        busId: 'B-24X-01',
        route: '24X',
        currentLocation: { lat: 28.6239, lng: 77.2190 },
        status: 'active',
        capacity: 50,
        currentPassengers: 42,
        driver: { name: 'Mike Johnson', id: 'D003', contact: '+91-9876543212' },
        speed: 18,
        delay: 1
      },
      {
        busId: 'B-36C-01',
        route: '36C',
        currentLocation: { lat: 28.6339, lng: 77.1990 },
        status: 'maintenance',
        capacity: 40,
        currentPassengers: 0,
        speed: 0,
        delay: 0
      },
      {
        busId: 'B-24X-02',
        route: '24X',
        currentLocation: { lat: 28.6089, lng: 77.2150 },
        status: 'active',
        capacity: 50,
        currentPassengers: 15,
        driver: { name: 'Sarah Wilson', id: 'D004', contact: '+91-9876543213' },
        speed: 22,
        delay: 5
      }
    ]
    
    await Bus.insertMany(buses)
    console.log('✅ Buses seeded successfully')
    
    // Sample Users with Green Scores
    const users = [
      {
        userId: 'user1',
        name: 'Alice Cooper',
        email: 'alice@example.com',
        greenScore: {
          totalCO2Saved: 156.8,
          totalTrips: 89,
          totalDistance: 920.5,
          totalMoneySaved: 5520,
          level: 8,
          achievements: [
            { id: 'first_ride', name: 'First Ride', unlockedAt: new Date('2024-01-15') },
            { id: 'eco_warrior', name: 'Eco Warrior', unlockedAt: new Date('2024-02-20') },
            { id: 'climate_hero', name: 'Climate Hero', unlockedAt: new Date('2024-08-10') }
          ]
        },
        trips: [
          { date: new Date(), route: '12A', from: 'Airport', to: 'Central', distance: 15, co2Saved: 2.55, moneySaved: 90 }
        ]
      },
      {
        userId: 'user2',
        name: 'Bob Green',
        email: 'bob@example.com',
        greenScore: {
          totalCO2Saved: 134.2,
          totalTrips: 76,
          totalDistance: 789.1,
          totalMoneySaved: 4734,
          level: 7,
          achievements: [
            { id: 'first_ride', name: 'First Ride', unlockedAt: new Date('2024-01-20') },
            { id: 'regular_commuter', name: 'Regular Commuter', unlockedAt: new Date('2024-02-28') }
          ]
        }
      },
      {
        userId: 'demo_user',
        name: 'Demo User',
        email: 'demo@transittrack.com',
        greenScore: {
          totalCO2Saved: 42.5,
          totalTrips: 22,
          totalDistance: 180.5,
          totalMoneySaved: 450,
          level: 3,
          achievements: [
            { id: 'first_ride', name: 'First Ride', unlockedAt: new Date('2024-01-15') },
            { id: 'eco_warrior', name: 'Eco Warrior', unlockedAt: new Date('2024-02-20') }
          ]
        }
      }
    ]
    
    await User.insertMany(users)
    console.log('✅ Users seeded successfully')
    
    // Sample Feedback
    const feedback = [
      {
        type: 'issue',
        title: 'Bus was 15 minutes late',
        description: 'Route 12A was significantly delayed this morning during rush hour. This has been happening frequently.',
        route: '12A',
        priority: 'medium',
        status: 'investigating',
        author: { name: 'Anonymous User', isAnonymous: true },
        upvotes: 12,
        responses: [
          { message: 'Thank you for reporting. We are investigating the traffic patterns on this route.', author: 'Admin', timestamp: new Date() }
        ]
      },
      {
        type: 'suggestion',
        title: 'Add route to Tech Park',
        description: 'Many commuters travel from University to Tech Park daily. A direct route would be very helpful and reduce travel time.',
        route: 'New Route',
        priority: 'high',
        status: 'under-review',
        author: { name: 'Tech Worker', email: 'tech@example.com', isAnonymous: false },
        upvotes: 28
      },
      {
        type: 'rating',
        title: 'Excellent service on Route 24X',
        description: 'Driver was very courteous, bus was clean and on time. Great experience overall!',
        route: '24X',
        priority: 'low',
        status: 'acknowledged',
        author: { name: 'Daily Commuter', isAnonymous: true },
        rating: 5,
        upvotes: 5
      },
      {
        type: 'compliment',
        title: 'Great improvement in punctuality',
        description: 'Route 36C has been much more reliable lately. Thank you for the improvements!',
        route: '36C',
        priority: 'low',
        status: 'acknowledged',
        author: { name: 'Happy Commuter', isAnonymous: true },
        upvotes: 8
      }
    ]
    
    await Feedback.insertMany(feedback)
    console.log('✅ Feedback seeded successfully')
    
    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Seeded: ${routes.length} routes, ${buses.length} buses, ${users.length} users, ${feedback.length} feedback items`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

module.exports = seedData

// Run seeding if this file is executed directly
if (require.main === module) {
  const mongoose = require('mongoose')
  const dotenv = require('dotenv')
  
  dotenv.config()
  
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transittrack'
  
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('📦 Connected to MongoDB for seeding')
      return seedData()
    })
    .then(() => {
      console.log('✅ Seeding completed, closing connection')
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      mongoose.connection.close()
      process.exit(1)
    })
}