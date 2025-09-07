// server/src/routes/maintenance.js
const { Router } = require('express')
const { Maintenance, Bus } = require('../models')

const router = Router()

// Get all maintenance records with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      busId, 
      type, 
      priority,
      scheduledDateFrom,
      scheduledDateTo,
      technicianId,
      page = 1, 
      limit = 20,
      sortBy = 'scheduledDate',
      sortOrder = 'desc'
    } = req.query
    
    // Build filter object
    let filter = {}
    if (status) filter.status = status
    if (busId) filter.busId = busId
    if (type) filter.type = type
    if (priority) filter.priority = priority
    if (technicianId) filter['technician.id'] = technicianId
    
    // Date range filtering
    if (scheduledDateFrom || scheduledDateTo) {
      filter.scheduledDate = {}
      if (scheduledDateFrom) filter.scheduledDate.$gte = new Date(scheduledDateFrom)
      if (scheduledDateTo) filter.scheduledDate.$lte = new Date(scheduledDateTo)
    }
    
    const skip = (page - 1) * limit
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    
    const maintenance = await Maintenance.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
    
    const total = await Maintenance.countDocuments(filter)
    
    res.json({
      success: true,
      data: maintenance,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: maintenance.length,
        totalItems: total
      },
      filters: {
        status,
        busId,
        type,
        priority,
        scheduledDateFrom,
        scheduledDateTo
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance records:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance records',
      error: error.message
    })
  }
})

// Get specific maintenance record
router.get('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      })
    }
    
    // Get associated bus information
    const bus = await Bus.findOne({ busId: maintenance.busId })
    
    res.json({
      success: true,
      data: {
        ...maintenance.toObject(),
        busInfo: bus
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance record:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance record',
      error: error.message
    })
  }
})

// Schedule new maintenance
router.post('/', async (req, res) => {
  try {
    const { 
      busId, 
      type, 
      title,
      description, 
      scheduledDate, 
      priority,
      technician, 
      estimatedDuration,
      parts,
      cost
    } = req.body
    
    // Validate required fields
    if (!busId || !type || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'busId, type, and scheduledDate are required fields'
      })
    }
    
    // Check if bus exists
    const bus = await Bus.findOne({ busId })
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      })
    }
    
    // Generate unique maintenance ID
    const maintenanceId = `MAINT-${busId}-${Date.now()}`
    
    const maintenance = new Maintenance({
      maintenanceId,
      busId,
      type,
      title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Maintenance`,
      description,
      scheduledDate: new Date(scheduledDate),
      priority: priority || 'medium',
      technician,
      estimatedDuration,
      parts: parts || [],
      cost
    })
    
    await maintenance.save()
    
    // Update bus status if maintenance is scheduled for today or in the past
    const now = new Date()
    const maintenanceDate = new Date(scheduledDate)
    
    if (maintenanceDate <= now) {
      await Bus.findOneAndUpdate(
        { busId },
        { status: 'maintenance' }
      )
      
      // Create notification for immediate maintenance
      if (req.io) {
        req.io.emit('maintenanceStarted', {
          type: 'maintenance_started',
          busId,
          maintenanceId: maintenance.maintenanceId
        })
      }
    }
    
    res.status(201).json({
      success: true,
      message: 'Maintenance scheduled successfully',
      data: maintenance
    })
  } catch (error) {
    console.error('Error scheduling maintenance:', error)
    res.status(500).json({
      success: false,
      message: 'Error scheduling maintenance',
      error: error.message
    })
  }
})

// Update maintenance status and details
router.put('/:id', async (req, res) => {
  try {
    const { 
      status, 
      completedDate, 
      notes, 
      cost, 
      parts,
      actualDuration,
      technician
    } = req.body
    
    const updateData = {}
    if (status) updateData.status = status
    if (completedDate) updateData.completedDate = new Date(completedDate)
    if (notes) updateData.notes = notes
    if (cost !== undefined) updateData.cost = cost
    if (parts) updateData.parts = parts
    if (actualDuration) updateData.actualDuration = actualDuration
    if (technician) updateData.technician = technician
    
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      })
    }
    
    // Update bus status based on maintenance status
    if (status === 'completed') {
      await Bus.findOneAndUpdate(
        { busId: maintenance.busId },
        { status: 'active' }
      )
      
      // Emit completion event
      if (req.io) {
        req.io.emit('maintenanceCompleted', {
          type: 'maintenance_completed',
          busId: maintenance.busId,
          maintenanceId: maintenance.maintenanceId
        })
      }
    } else if (status === 'in-progress') {
      await Bus.findOneAndUpdate(
        { busId: maintenance.busId },
        { status: 'maintenance' }
      )
    }
    
    res.json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: maintenance
    })
  } catch (error) {
    console.error('Error updating maintenance:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating maintenance record',
      error: error.message
    })
  }
})

// Delete maintenance record
router.delete('/:id', async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id)
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      })
    }
    
    // If deleting an active maintenance, restore bus status
    if (maintenance.status === 'in-progress' || maintenance.status === 'scheduled') {
      await Bus.findOneAndUpdate(
        { busId: maintenance.busId },
        { status: 'active' }
      )
    }
    
    res.json({
      success: true,
      message: 'Maintenance record deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting maintenance:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting maintenance record',
      error: error.message
    })
  }
})

// Get maintenance statistics and analytics
router.get('/stats/summary', async (req, res) => {
  try {
    // Maintenance by status
    const statusStats = await Maintenance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgCost: { $avg: '$cost' },
          totalCost: { $sum: '$cost' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    // Maintenance by type
    const typeStats = await Maintenance.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgCost: { $avg: '$cost' },
          avgDuration: { $avg: '$estimatedDuration' }
        }
      },
      { $sort: { count: -1 } }
    ])
    
    // Maintenance by priority
    const priorityStats = await Maintenance.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])
    
    // Upcoming maintenance (next 7 days)
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const upcomingCount = await Maintenance.countDocuments({
      scheduledDate: { $lte: sevenDaysFromNow, $gte: new Date() },
      status: 'scheduled'
    })
    
    // Overdue maintenance
    const overdueCount = await Maintenance.countDocuments({
      scheduledDate: { $lt: new Date() },
      status: 'scheduled'
    })
    
    res.json({
      success: true,
      data: {
        byStatus: statusStats,
        byType: typeStats,
        byPriority: priorityStats,
        summary: {
          upcoming: upcomingCount,
          overdue: overdueCount,
          totalRecords: await Maintenance.countDocuments()
        }
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance statistics:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance statistics',
      error: error.message
    })
  }
})

// Get maintenance calendar/schedule
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params
    
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)
    
    const maintenanceCalendar = await Maintenance.find({
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .sort({ scheduledDate: 1 })
    .select('maintenanceId busId type title scheduledDate status priority')
    
    // Group by date
    const calendar = {}
    maintenanceCalendar.forEach(maintenance => {
      const dateKey = maintenance.scheduledDate.toISOString().split('T')[0]
      if (!calendar[dateKey]) {
        calendar[dateKey] = []
      }
      calendar[dateKey].push(maintenance)
    })
    
    res.json({
      success: true,
      data: {
        year: parseInt(year),
        month: parseInt(month),
        calendar,
        totalItems: maintenanceCalendar.length
      }
    })
  } catch (error) {
    console.error('Error fetching maintenance calendar:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance calendar',
      error: error.message
    })
  }
})

module.exports = router