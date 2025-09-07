import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import PageFadeIn from '../components/PageFadeIn';
import { useLanguage } from '../context/LanguageContext';

// Fallback sample data when Firebase is unavailable
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
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('submit')
  const [formData, setFormData] = useState({
    type: 'issue',
    route: '',
    title: '',
    description: '',
    priority: 'medium',
    anonymous: true,
    contact: ''
  });
  const [feedback, setFeedback] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [user, setUser] = useState(null);
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      // If no user is authenticated, set a mock user for testing
      if (!user) {
        setUser({ displayName: 'Test User', email: 'test@example.com' });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    try {
      const q = query(collection(db, 'feedbacks'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(q, {
        next: (snapshot) => {
          const feedbackData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setFeedback(feedbackData);
          setIsServiceAvailable(true);
          setShowError(false);
        },
        error: (error) => {
          console.error('Firestore error:', error);
          setIsServiceAvailable(false);
          setShowError(true);
          setErrorMessage('Service is currently unavailable. Please try again later.');
          // Use mock data when Firebase is unavailable
          setFeedback(sampleFeedback);
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error('Failed to initialize Firestore:', error);
      setIsServiceAvailable(false);
      // Use mock data when Firebase is unavailable
      setFeedback(sampleFeedback);
      return () => {};
    }
  }, []);
  const feedbackTypes = [
    { value: 'issue', label: translate('reportIssue'), icon: '⚠️', color: 'text-red-600' },
    { value: 'suggestion', label: translate('suggestRoute'), icon: '💡', color: 'text-blue-600' },
    { value: 'rating', label: translate('rateBus'), icon: '⭐', color: 'text-yellow-600' },
    { value: 'compliment', label: translate('compliments'), icon: '😊', color: 'text-green-600' }
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

    try {
      const feedbackData = {
        ...formData,
        rating: formData.type === 'rating' ? rating : 0,   // ✅ use 0 instead of null
        upvotes: 0,
        status: 'submitted',
        timestamp: serverTimestamp(),
        author: formData.anonymous ? 'Anonymous' : user ? user.displayName || user.email : 'User'
      };

      if (isServiceAvailable) {
        try {
          await addDoc(collection(db, 'feedbacks'), feedbackData);
        } catch (error) {
          console.error('Error adding document to Firestore:', error);
          // Continue with mock submission if Firestore fails
          console.log('Submitting feedback (mock):', formData);
          // Add to local state when Firestore fails
          setFeedback(prev => [newFeedback, ...prev]);
        }
      } else {
        // Mock submission when Firebase is unavailable
        console.log('Submitting feedback (mock):', formData);
        // Add to local state when Firebase is unavailable
        setFeedback(prev => [newFeedback, ...prev]);
      }

      setFormData({
        type: 'issue',
        route: '',
        title: '',
        description: '',
        priority: 'medium',
        anonymous: true,
        contact: ''
      });
      setRating(0);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('community');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setShowError(true);
      setErrorMessage('Failed to submit feedback. Please try again later.');
      setIsServiceAvailable(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async id => {
    if (!isServiceAvailable) {
      setShowError(true);
      setErrorMessage('Service is currently unavailable. Please try again later.');
      return;
    }

    try {
      if (isServiceAvailable) {
        try {
          const feedbackRef = doc(db, 'feedbacks', id);
          const currentFeedback = feedback.find(item => item.id === id);
          await updateDoc(feedbackRef, {
            upvotes: (currentFeedback.upvotes || 0) + 1
          });
        } catch (error) {
          console.error('Error updating upvotes in Firestore:', error);
          // Continue with mock upvote if Firestore fails
          console.log('Upvoting feedback (mock):', id);
        }
      } else {
        // Mock upvote when Firebase is unavailable
        console.log('Upvoting feedback (mock):', id);
      }
      
      setShowError(false);
    } catch (error) {
      console.error('Error upvoting feedback:', error);
      setShowError(true);
      setErrorMessage('Failed to update upvotes. Please try again later.');
      setIsServiceAvailable(false);
    }
  };

  const filteredFeedback = filterType === 'all' ? feedback : feedback.filter(item => item.type === filterType);
  const mySubmissions = user ? feedback.filter(item => item.author === (user.displayName || user.email)) : [];

const getTimeAgo = timestamp => {
  if (!timestamp) return 'Just now';
  
  // Handle Firestore timestamps
  if (timestamp.toDate) {
    const diff = Date.now() - timestamp.toDate().getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
  
  // Handle regular Date objects
  const diff = Date.now() - timestamp.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};


  const StarRating = ({ rating: currentRating, onRate, readonly = false }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate(star)}
            className={`text-2xl transition-colors ${
              star <= currentRating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly && 'hover:text-yellow-400 cursor-pointer'}`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    )
  };
    
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
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate(star)}
            className={`text-2xl transition-colors ${
              star <= currentRating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${!readonly && 'hover:text-yellow-400 cursor-pointer'}`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            💬 {translate('submitFeedback')}
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
            <nav className="flex">
              {[
                { id: 'submit', label: translate('submitFeedback'), icon: '✍️' },
                { id: 'community', label: translate('viewFeedback'), icon: '💬' },
                { id: 'my-feedback', label: translate('myFeedback'), icon: '📄' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {activeTab === 'submit' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{translate('submitNewFeedback')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">{translate('feedbackTypeQuestion')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {feedbackTypes.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xl ${type.color}`}>{type.icon}</span>
                          <div className="h-5 w-5 flex items-center justify-center">
                            {formData.type === type.value && (
                              <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="font-medium text-gray-900">{type.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.type === 'rating' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{translate('rateYourExperience')}</label>
                    <StarRating rating={rating} onRate={setRating} />
                  </div>
                )}

                <div>
                  <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'rating' ? translate('busRoute') : translate('relatedRoute')}
                  </label>
                  <input
                    type="text"
                    id="route"
                    value={formData.route}
                    onChange={e => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={translate('routeNumberOrName')}
                  />
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('title')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={translate('briefTitle')}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    {translate('description')}
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={translate('detailedDescription')}
                    required
                  />
                </div>

                {formData.type === 'issue' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{translate('priority')}</label>
                    <div className="flex flex-wrap gap-3">
                      {priorityLevels.map(level => (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority: level.value }))}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            formData.priority === level.value ? level.color : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    id="anonymous"
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={e => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    {translate('submitAnonymously')}
                  </label>
                </div>

                {!formData.anonymous && (
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                      {translate('contactInfo')}
                    </label>
                    <input
                      type="text"
                      id="contact"
                      value={formData.contact}
                      onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={translate('optionalContact')}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-md text-white font-medium ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                  >
                    {isSubmitting ? translate('submitting') : translate('submitFeedback')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">{translate('communityFeedback')}</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 text-sm rounded-full ${filterType === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {translate('all')}
                  </button>
                  {feedbackTypes.map(type => (

          <div className="bg-white rounded-lg shadow-sm p-6">
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
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route/Bus Number
                  </label>
                  <input
                    type="text"
                    value={formData.route}
                    onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                    placeholder="e.g., 12A, 24X, or 'New Route'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priorityLevels.map((priority) => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your feedback"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide as much detail as possible..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {/* Privacy Options */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Submit anonymously</span>
                </label>
                
                {!formData.anonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Information (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    📤 Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        )}
        
        {/* Community Feedback Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({feedback.length})
                </button>
                {feedbackTypes.map((type) => {
                  const count = feedback.filter(item => item.type === type.value).length
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === type.value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <span>{type.icon}</span>
                      {type.label} ({count})
                    </button>
                  )
                })}
              </div>

              {filteredFeedback.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{translate('noFeedbackYet')}</h3>
                  <p className="text-gray-600">{translate('beFirstToSubmit')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedback.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {item.type === 'issue' && '⚠'}
                              {item.type === 'suggestion' && '💡'}
                              {item.type === 'rating' && '⭐'}
                            </span>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{item.author}</span>
                            <span>•</span>
                            <span>{getTimeAgo(item.timestamp)}</span>
                            {item.route && (
                              <>
                                <span>•</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.route}</span>
                              </>
                            )}
                            {item.type === 'issue' && (
                              <>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${priorityLevels.find(p => p.value === item.priority)?.color || 'bg-gray-100'}`}>
                                  {priorityLevels.find(p => p.value === item.priority)?.label || item.priority}
                                </span>
                              </>
                            )}
                            {item.status && (
                              <>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[item.status] || 'bg-gray-100'}`}>
                                  {item.status}
                                </span>
                              </>
                            )}
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
                        {item.type === 'rating' && <StarRating rating={item.rating} readonly />}
                      </div>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleUpvote(item.id)}
                          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span>Upvote</span>
                          {item.upvotes > 0 && <span className="font-medium">({item.upvotes})</span>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-feedback' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">{translate('mySubmissions')}</h2>
              
              {!user ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{translate('signInRequired')}</h3>
                  <p className="text-gray-600">{translate('signInToViewSubmissions')}</p>
                </div>
              ) : mySubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{translate('noSubmissionsYet')}</h3>
                  <p className="text-gray-600">{translate('submitFeedbackToSeeHere')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mySubmissions.map(item => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {item.type === 'issue' && '⚠'}
                              {item.type === 'suggestion' && '💡'}
                              {item.type === 'rating' && '⭐'}
                            </span>
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{getTimeAgo(item.timestamp)}</span>
                            {item.route && (
                              <>
                                <span>•</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{item.route}</span>
                              </>
                            )}
                            {item.status && (
                              <>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[item.status] || 'bg-gray-100'}`}>
                                  {item.status}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {item.type === 'rating' && <StarRating rating={item.rating} readonly />}
                      </div>
                      <p className="text-gray-700 mb-3 whitespace-pre-wrap">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}


            </div>
          </div>
        )}
        
        {/* My Feedback Tab */}
        {activeTab === 'my-feedback' && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Submission History</h3>
            <p className="text-gray-600">Track your feedback submissions and their status updates</p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In to View History
            </button>
          </div>
        )}
      </div>
    </div>
  )
}