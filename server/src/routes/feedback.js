const { Router } = require('express')
const { Feedback } = require('../models')
const router = Router()

// Get all feedback with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { type, status, route, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query
    
    let filter = {}
    if (type) filter.type = type
    if (status) filter.status = status
    if (route) filter.route = route
    
    const skip = (page - 1) * limit
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    
    const feedback = await Feedback.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
    
    const total = await Feedback.countDocuments(filter)
    
    res.json({
      success: true,
      data: feedback,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: feedback.length,
        totalItems: total
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    })
  }
})

// Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { type, title, description, route, priority, author, rating, metadata } = req.body
    
    const feedback = new Feedback({
      type,
      title,
      description,
      route,
      priority: priority || 'medium',
      author: {
        name: author?.name || 'Anonymous',
        email: author?.email,
        isAnonymous: !author?.email
      },
      rating: type === 'rating' ? rating : undefined,
      metadata: {
        ...metadata,
        timestamp: new Date()
      }
    })
    
    await feedback.save()
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    })
  }
})

// Get specific feedback
router.get('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      })
    }
    
    res.json({
      success: true,
      data: feedback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    })
  }
})

// Update feedback status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Feedback status updated',
      data: feedback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating feedback status',
      error: error.message
    })
  }
})

// Upvote feedback
router.post('/:id/upvote', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    )
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Feedback upvoted',
      data: { upvotes: feedback.upvotes }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error upvoting feedback',
      error: error.message
    })
  }
})

// Add response to feedback (admin only)
router.post('/:id/response', async (req, res) => {
  try {
    const { message, author } = req.body
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          responses: {
            message,
            author: author || 'Admin',
            timestamp: new Date()
          }
        }
      },
      { new: true }
    )
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      })
    }
    
    res.json({
      success: true,
      message: 'Response added successfully',
      data: feedback
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message
    })
  }
})

// Get feedback statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgUpvotes: { $avg: '$upvotes' }
        }
      }
    ])
    
    const statusStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    const priorityStats = await Feedback.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])
    
    res.json({
      success: true,
      data: {
        byType: stats,
        byStatus: statusStats,
        byPriority: priorityStats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback statistics',
      error: error.message
    })
  }
})

module.exports = router


