const mongoose = require('mongoose')
const { Notification, Maintenance } = require('./models')
const dotenv = require('dotenv')

dotenv.config()

const seedNotifications = async () => {
  try {
    console.log('🔔 Seeding notifications...')
    
    // Clear existing notifications
    await Notification.deleteMany({})
    
    const notifications = [
      {
        notificationId: 'NOTIF-001',
        type: 'delay',
        title: 'Route 12A Experiencing Delays',
        message: 'Due to heavy traffic on Ring Road, Route 12A buses are experiencing 10-15 minute delays. Please plan your journey accordingly.',
        route: '12A',
        severity: 'medium',
        targetAudience: 'route_users',
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        metadata: {
          createdBy: 'Traffic Control Center',
          affectedRoutes: ['12A'],
          estimatedDuration: 120
        }
      },
      {
        notificationId: 'NOTIF-002',
        type: 'announcement',
        title: 'New Night Service Route 48N',
        message: 'We are excited to announce the launch of our new night service Route 48N, connecting Downtown to Airport. Service starts from Monday.',
        severity: 'low',
        targetAudience: 'all',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        metadata: {
          createdBy: 'Operations Manager',
          affectedRoutes: ['48N']
        }
      },
      {
        notificationId: 'NOTIF-003',
        type: 'maintenance',
        title: 'Route 36C Temporary Service Disruption',
        message: 'Route 36C will have limited service tomorrow due to scheduled maintenance of buses. Alternative routes 24X and 12A are available.',
        route: '36C',
        severity: 'high',
        targetAudience: 'route_users',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
        metadata: {
          createdBy: 'Maintenance Team',
          affectedRoutes: ['36C'],
          estimatedDuration: 480
        }
      }
    ]
    
    await Notification.insertMany(notifications)
    console.log(`✅ ${notifications.length} notifications seeded successfully`)
    
  } catch (error) {
    console.error('❌ Error seeding notifications:', error)
  }
}

const seedMaintenance = async () => {
  try {
    console.log('🔧 Seeding maintenance records...')
    
    // Clear existing maintenance records
    await Maintenance.deleteMany({})
    
    const maintenanceRecords = [
      {
        maintenanceId: 'MAINT-B-12A-01-001',
        busId: 'B-12A-01',
        type: 'routine',
        title: 'Monthly Safety Inspection',
        description: 'Comprehensive monthly safety inspection including brake system, lighting, engine diagnostics, and safety equipment check.',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        priority: 'medium',
        estimatedDuration: 4,
        technician: {
          name: 'Michael Rodriguez',
          id: 'TECH001',
          contact: '+91-9876543220',
          specialization: 'Safety Systems & Inspection'
        },
        parts: [
          { name: 'Brake Pads', cost: 2500, quantity: 4, supplier: 'BrakeTech Ltd' },
          { name: 'Oil Filter', cost: 300, quantity: 1, supplier: 'FilterMax' }
        ],
        cost: 3250
      },
      {
        maintenanceId: 'MAINT-B-24X-01-002',
        busId: 'B-24X-01',
        type: 'repair',
        title: 'Air Conditioning System Repair',
        description: 'AC compressor replacement and refrigerant refill. System was not cooling effectively during hot weather.',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        priority: 'high',
        estimatedDuration: 6,
        technician: {
          name: 'Sarah Chen',
          id: 'TECH002',
          contact: '+91-9876543221',
          specialization: 'HVAC Systems'
        },
        parts: [
          { name: 'AC Compressor', cost: 15000, quantity: 1, supplier: 'CoolTech Solutions' },
          { name: 'Refrigerant R134a', cost: 800, quantity: 2, supplier: 'CoolTech Solutions' }
        ],
        cost: 16050
      },
      {
        maintenanceId: 'MAINT-B-36C-01-003',
        busId: 'B-36C-01',
        type: 'inspection',
        title: 'Annual Government Inspection',
        description: 'Mandatory annual inspection required by transport authority. Includes fitness certificate renewal.',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: 'medium',
        estimatedDuration: 8,
        technician: {
          name: 'John Kumar',
          id: 'TECH003',
          contact: '+91-9876543222',
          specialization: 'Vehicle Inspection & Certification'
        },
        parts: [],
        cost: 2000 // Inspection fees
      }
    ]
    
    await Maintenance.insertMany(maintenanceRecords)
    console.log(`✅ ${maintenanceRecords.length} maintenance records seeded successfully`)
    
  } catch (error) {
    console.error('❌ Error seeding maintenance records:', error)
  }
}

const runNewModelSeeding = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transittrack'
  
  try {
    await mongoose.connect(MONGO_URI)
    console.log('📦 Connected to MongoDB for new model seeding')
    
    await seedNotifications()
    await seedMaintenance()
    
    console.log('🎉 New model seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ New model seeding failed:', error)
  } finally {
    mongoose.connection.close()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runNewModelSeeding()
}

module.exports = { seedNotifications, seedMaintenance }