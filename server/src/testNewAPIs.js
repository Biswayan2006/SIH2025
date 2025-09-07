// server/src/testNewAPIs.js
const axios = require('axios')

const BASE_URL = 'http://localhost:4001/api'

const testNotificationsAPI = async () => {
  try {
    console.log('🔔 Testing Notifications API...')
    
    // Test GET notifications
    const response = await axios.get(`${BASE_URL}/notifications`)
    console.log(`✅ GET /notifications: ${response.data.data.length} notifications found`)
    
    // Test POST notification
    const newNotification = {
      type: 'announcement',
      title: 'API Test Notification',
      message: 'This is a test notification created via API',
      severity: 'low',
      targetAudience: 'all'
    }
    
    const createResponse = await axios.post(`${BASE_URL}/notifications`, newNotification)
    console.log('✅ POST /notifications: Notification created successfully')
    
    // Test statistics
    const statsResponse = await axios.get(`${BASE_URL}/notifications/stats/summary`)
    console.log('✅ GET /notifications/stats/summary: Statistics retrieved')
    
  } catch (error) {
    console.error('❌ Notifications API test failed:', error.message)
  }
}

const testMaintenanceAPI = async () => {
  try {
    console.log('🔧 Testing Maintenance API...')
    
    // Test GET maintenance
    const response = await axios.get(`${BASE_URL}/maintenance`)
    console.log(`✅ GET /maintenance: ${response.data.data.length} maintenance records found`)
    
    // Test POST maintenance
    const newMaintenance = {
      busId: 'B-12A-01',
      type: 'routine',
      title: 'API Test Maintenance',
      description: 'This is a test maintenance record created via API',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: 'low'
    }
    
    const createResponse = await axios.post(`${BASE_URL}/maintenance`, newMaintenance)
    console.log('✅ POST /maintenance: Maintenance record created successfully')
    
    // Test statistics
    const statsResponse = await axios.get(`${BASE_URL}/maintenance/stats/summary`)
    console.log('✅ GET /maintenance/stats/summary: Statistics retrieved')
    
  } catch (error) {
    console.error('❌ Maintenance API test failed:', error.message)
  }
}

const runAPITests = async () => {
  console.log('🧪 Starting API Tests...')
  console.log('Make sure your server is running on port 4001')
  console.log('─'.repeat(50))
  
  await testNotificationsAPI()
  console.log('')
  await testMaintenanceAPI()
  
  console.log('─'.repeat(50))
  console.log('🎉 API Testing completed!')
}

if (require.main === module) {
  runAPITests()
}