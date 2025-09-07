const mongoose = require('mongoose')
const { Notification } = require('./models')
const dotenv = require('dotenv')

dotenv.config()

const checkNotifications = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/transittrack'
    await mongoose.connect(MONGO_URI)
    console.log('📦 Connected to MongoDB')
    
    const notifications = await Notification.find({})
    console.log(`Found ${notifications.length} notifications:`)
    notifications.forEach(notification => {
      console.log(`- ${notification.title} (${notification.type}) - Expires: ${notification.expiresAt} - Active: ${notification.isActive}`)
    })
    
    mongoose.connection.close()
  } catch (error) {
    console.error('Error:', error)
  }
}

checkNotifications()