// server/src/routes/notifications.js
const { Router } = require('express')
const { Notification } = require('../models')

const router = Router()

// Get all notifications with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      severity, 
      targetAudience, 
      route, 
      isActive = 'true',
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    // Build filter object based on query parameters
    let filter = { isActive: isActive === 'true' }
    if (type) filter.type = type
    if (severity) filter.severity = severity
    if (targetAudience) filter.targetAudience = targetAudience
    if (route) filter.route = route
    
    // Only show non-expired notifications
    if (req.query.includeExpired !== 'true') {
      filter.$or = [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null },
        { expiresAt: { $exists: false } }
      ]
    }
    
    const skip = (page - 1) * limit
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    
    const notifications = await Notification.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
    
    const total = await Notification.countDocuments(filter)
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: notifications.length,
        totalItems: total
      },
      filters: {
        type,
        severity,
        targetAudience,
        route,
        isActive
      }
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    })
  }
})

// Get a specific notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }
    
    res.json({
      success: true,
      data: notification
    })
  } catch (error) {
    console.error('Error fetching notification:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    })
  }
})

// Create new notification
router.post('/', async (req, res) => {
  try {
    const { 
      type, 
      title, 
      message, 
      route, 
      severity, 
      targetAudience, 
      expiresAt,
      metadata 
    } = req.body
    
    // Validate required fields
    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type, title, and message are required fields'
      })
    }
    
    // Generate unique notification ID
    const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const notification = new Notification({
      notificationId,
      type,
      title,
      message,
      route,
      severity: severity || 'medium',
      targetAudience: targetAudience || 'all',
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24 hours
      metadata: {
        createdBy: metadata?.createdBy || 'System',
        affectedRoutes: metadata?.affectedRoutes || (route ? [route] : []),
        estimatedDuration: metadata?.estimatedDuration || null,
        ...metadata
      }
    })
    
    await notification.save()
    
    // Emit to Socket.IO for real-time updates if available
    if (req.io) {
      req.io.emit('newNotification', {
        type: 'notification_created',
        data: notification
      })
      
      // Emit to specific route subscribers if it's route-specific
      if (route) {
        req.io.to(`route_${route}`).emit('routeNotification', notification)
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    })
  }
})

// Update notification status or content
router.put('/:id', async (req, res) => {
  try {
    const { isActive, title, message, severity, expiresAt } = req.body
    
    const updateData = {}
    if (isActive !== undefined) updateData.isActive = isActive
    if (title) updateData.title = title
    if (message) updateData.message = message
    if (severity) updateData.severity = severity
    if (expiresAt) updateData.expiresAt = new Date(expiresAt)
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }
    
    // Emit update to connected clients
    if (req.io) {
      req.io.emit('notificationUpdated', {
        type: 'notification_updated',
        data: notification
      })
    }
    
    res.json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    })
  }
})

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      })
    }
    
    // Emit deletion to connected clients
    if (req.io) {
      req.io.emit('notificationDeleted', {
        type: 'notification_deleted',
        data: { id: req.params.id }
      })
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    })
  }
})

// Get notification statistics and analytics
router.get('/stats/summary', async (req, res) => {
  try {
    // Notifications by type
    const typeStats = await Notification.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgSeverity: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ['$severity', 'low'] }, then: 1 },
                  { case: { $eq: ['$severity', 'medium'] }, then: 2 },
                  { case: { $eq: ['$severity', 'high'] }, then: 3 },
                  { case: { $eq: ['$severity', 'critical'] }, then: 4 }
                ],
                default: 2
              }
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    // Notifications by severity
    const severityStats = await Notification.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    // Recent notifications (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentCount = await Notification.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      isActive: true
    })
    
    // Total active notifications
    const totalActive = await Notification.countDocuments({ isActive: true })
    
    res.json({
      success: true,
      data: {
        byType: typeStats,
        bySeverity: severityStats,
        summary: {
          totalActive,
          recentCount,
          averagePerDay: Math.round((recentCount / 7) * 10) / 10
        }
      }
    })
  } catch (error) {
    console.error('Error fetching notification statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics',
      error: error.message
    })
  }
})

module.exports = router