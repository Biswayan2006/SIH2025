import { useState, useEffect } from 'react'
import PageFadeIn from '../components/PageFadeIn'

const sampleFeedback = [
  {
    id: 1,
    type: 'issue',
    title: 'Bus was 15 minutes late',
    description: 'Route 12A was significantly delayed this morning',
    route: '12A',
    status: 'investigating',
    priority: 'medium',
    author: 'Anonymous User',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    upvotes: 12,
    responses: 3
  },
  {
    id: 2,
    type: 'suggestion',
    title: 'Add route to Tech Park',
    description: 'Many commuters travel from University to Tech Park daily. A direct route would be very helpful.',
    route: 'New Route',
    status: 'under-review',
    priority: 'high',
    author: 'Tech Worker',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    upvotes: 28,
    responses: 1
  },
  {
    id: 3,
    type: 'rating',
    title: 'Excellent service on Route 24X',
    description: 'Driver was very courteous, bus was clean and on time. Great experience!',
    route: '24X',
    status: 'acknowledged',
    priority: 'low',
    author: 'Daily Commuter',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    upvotes: 5,
    responses: 0,
    rating: 5
  }
]

export default function Feedback() {
  const [activeTab, setActiveTab] = useState('submit')
  const [formData, setFormData] = useState({
    type: 'issue',
    route: '',
    title: '',
    description: '',
    priority: 'medium',
    anonymous: true,
    contact: ''
  })
  const [feedback, setFeedback] = useState(sampleFeedback)
  const [filterType, setFilterType] = useState('all')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [rating, setRating] = useState(0)
  
  const feedbackTypes = [
    { value: 'issue', label: 'Report an Issue', icon: '⚠️', color: 'text-red-600' },
    { value: 'suggestion', label: 'Suggest a Route', icon: '💡', color: 'text-blue-600' },
    { value: 'rating', label: 'Rate a Bus', icon: '⭐', color: 'text-yellow-600' },
    { value: 'compliment', label: 'Give Compliment', icon: '😊', color: 'text-green-600' }
  ]
  
  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ]
  
  const statusColors = {
    'submitted': 'bg-blue-100 text-blue-800',
    'investigating': 'bg-yellow-100 text-yellow-800',
    'under-review': 'bg-purple-100 text-purple-800',
    'resolved': 'bg-green-100 text-green-800',
    'acknowledged': 'bg-gray-100 text-gray-800'
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newFeedback = {
      id: feedback.length + 1,
      ...formData,
      status: 'submitted',
      author: formData.anonymous ? 'Anonymous User' : 'User',
      timestamp: new Date(),
      upvotes: 0,
      responses: 0,
      ...(formData.type === 'rating' && { rating })
    }
    
    setFeedback(prev => [newFeedback, ...prev])
    
    // Reset form
    setFormData({
      type: 'issue',
      route: '',
      title: '',
      description: '',
      priority: 'medium',
      anonymous: true,
      contact: ''
    })
    setRating(0)
    
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    setActiveTab('community')
  }
  
  const handleUpvote = (id) => {
    setFeedback(prev => prev.map(item => 
      item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
    ))
  }
  
  const filteredFeedback = filterType === 'all' 
    ? feedback 
    : feedback.filter(item => item.type === filterType)
  
  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }
  
  const StarRating = ({ rating: currentRating, onRate, readonly = false }) => {
    return (
      <div className="flex items-center gap-1" role="group" aria-label="Rating stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate(star)}
            onKeyDown={(e) => {
              if (!readonly && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onRate(star);
              }
            }}
            className={`text-2xl transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 rounded-sm ${
              star <= currentRating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly && 'hover:text-yellow-400 cursor-pointer'}`}
            disabled={readonly}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            aria-pressed={star <= currentRating}
          >
            ★
          </button>
        ))}
      </div>
    )
  }
  
  return (
    <PageFadeIn>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            💬 Community Feedback
          </h1>
          <p className="text-gray-600 mt-1">
            Help improve public transit by sharing your experiences and suggestions
          </p>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Thank you! Your feedback has been submitted successfully.</span>
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex" role="tablist" aria-label="Feedback tabs">
              {[
                { id: 'submit', label: 'Submit Feedback', icon: '✍️' },
                { id: 'community', label: 'Community Feedback', icon: '💬' },
                { id: 'my-feedback', label: 'My Submissions', icon: '📄' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                >
                  <span aria-hidden="true">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Submit Feedback Tab */}
        {activeTab === 'submit' && (
          <div 
            className="bg-white rounded-lg shadow-sm p-6" 
            role="tabpanel" 
            id="submit-panel" 
            aria-labelledby="submit-tab"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Submit New Feedback</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of feedback would you like to submit?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-pressed={formData.type === type.value}
                      aria-label={`Select feedback type: ${type.label}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className={`font-medium ${type.color}`}>{type.label}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Route Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="route-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Route/Bus Number
                  </label>
                  <input
                    type="text"
                    id="route-input"
                    value={formData.route}
                    onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="e.g., 12A, 24X, or 'New Route'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    aria-describedby="route-description"
                  />
                  <div id="route-description" className="sr-only">Enter the bus route number or name for your feedback</div>
                </div>
                
                <div>
                  <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    id="priority-select"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-describedby="priority-description"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                  <div id="priority-description" className="sr-only">Select the priority level for your feedback</div>
                </div>
              </div>
              
              {/* Rating (if rating type) */}
              {formData.type === 'rating' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating
                  </label>
                  <StarRating rating={rating} onRate={setRating} />
                </div>
              )}
              
              {/* Title */}
              <div>
                <label htmlFor="title-input" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title-input"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-describedby="title-description"
                />
                <div id="title-description" className="sr-only">Enter a brief title describing your feedback</div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description-textarea" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  id="description-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide as much detail as possible..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-describedby="description-help"
                />
                <div id="description-help" className="sr-only">Enter a detailed description of your feedback, including any relevant information</div>
              </div>
              
              {/* Privacy Options */}
              <div className="space-y-3">
                <label htmlFor="anonymous-checkbox" className="flex items-center gap-3">
                  <input
                    id="anonymous-checkbox"
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    aria-describedby="anonymous-help"
                  />
                  <span className="text-sm text-gray-700">Submit anonymously</span>
                </label>
                <div id="anonymous-help" className="sr-only">Check this box to submit your feedback without revealing your identity</div>
                
                {!formData.anonymous && (
                  <div>
                    <label htmlFor="contact-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information (Optional)
                    </label>
                    <input
                      id="contact-input"
                      type="email"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-describedby="contact-help"
                    />
                    <div id="contact-help" className="sr-only">Enter your email address if you would like to be contacted about your feedback</div>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                aria-label="Submit your feedback"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Submitting...</span>
                    <span className="sr-only">Please wait while your feedback is being submitted</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">📤</span> Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {/* Community Feedback Tab */}
        {activeTab === 'community' && (
          <div 
            className="space-y-6" 
            role="tabpanel" 
            id="community-panel" 
            aria-labelledby="community-tab"
          >
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter feedback by type">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={filterType === 'all'}
                  aria-label="Show all feedback"
                >
                  All Feedback
                </button>
                {feedbackTypes.map((type) => {
                  const count = feedback.filter(item => item.type === type.value).length
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 ${
                        filterType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-pressed={filterType === type.value}
                      aria-label={`Show ${type.label} feedback`}
                    >
                      <span aria-hidden="true">{type.icon}</span>
                      {type.label} ({count})
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Feedback List */}
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {feedbackTypes.find(t => t.value === item.type)?.icon}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>Route {item.route}</span>
                          <span>•</span>
                          <span>by {item.author}</span>
                          <span>•</span>
                          <span>{getTimeAgo(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        priorityLevels.find(p => p.value === item.priority)?.color
                      }`}>
                        {item.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[item.status]
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {item.rating && (
                    <div className="mb-3">
                      <StarRating rating={item.rating} readonly />
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpvote(item.id)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md"
                        aria-label={`Upvote this feedback (${item.upvotes} upvotes)`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                        {item.upvotes} upvotes
                      </button>
                      
                      <button 
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md"
                        aria-label={`View ${item.responses} responses`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7.93-6.7L5 14v-4l.07.01A8.013 8.013 0 0112 4c4.418 0 8 3.582 8 8z" />
                        </svg>
                        {item.responses} responses
                      </button>
                    </div>
                    
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md p-1"
                      aria-label={`View details for ${item.title}`}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* My Feedback Tab */}
        {activeTab === 'my-feedback' && (
          <div 
            className="bg-white rounded-lg shadow-sm p-12 text-center" 
            role="tabpanel" 
            id="my-feedback-panel" 
            aria-labelledby="my-feedback-tab"
          >
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Submission History</h3>
            <p className="text-gray-600">Track your feedback submissions and their status updates</p>
            <button 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              aria-label="Sign in to view your feedback history"
            >
              Sign In to View History
            </button>
          </div>
        )}
      </div>
    </div>
    </PageFadeIn>
  )
}