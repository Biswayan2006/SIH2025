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

export default function Feedback() {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('submit');
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
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
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
      }
    });
    return unsubscribe;
  }, []);

  const feedbackTypes = [
    { value: 'issue', label: translate('reportIssue'), icon: '⚠', color: 'text-red-600' },
    { value: 'suggestion', label: translate('suggestRoute'), icon: '💡', color: 'text-blue-600' },
    { value: 'rating', label: translate('rateBus'), icon: '⭐', color: 'text-yellow-600' }
  ];

  const priorityLevels = [
    { value: 'low', label: translate('low') || 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: translate('medium') || 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: translate('high') || 'High', color: 'bg-red-100 text-red-800' }
  ];

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    'under-review': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    acknowledged: 'bg-gray-100 text-gray-800'
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    if (!isServiceAvailable) {
      setShowError(true);
      setErrorMessage('Service is currently unavailable. Please try again later.');
      setIsSubmitting(false);
      return;
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


      await addDoc(collection(db, 'feedbacks'), feedbackData);

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
      console.error('Error adding document: ', error);
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
      const feedbackRef = doc(db, 'feedbacks', id);
      const currentFeedback = feedback.find(item => item.id === id);
      await updateDoc(feedbackRef, {
        upvotes: (currentFeedback.upvotes || 0) + 1
      });
      setShowError(false);
    } catch (error) {
      console.error('Error updating upvotes:', error);
      setShowError(true);
      setErrorMessage('Failed to update upvotes. Please try again later.');
      setIsServiceAvailable(false);
    }
  };

  const filteredFeedback = filterType === 'all' ? feedback : feedback.filter(item => item.type === filterType);
  const mySubmissions = user ? feedback.filter(item => item.author === (user.displayName || user.email)) : [];

const getTimeAgo = timestamp => {
  if (!timestamp || !timestamp.toDate) return 'Just now';
  const diff = Date.now() - timestamp.toDate().getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};


  const StarRating = ({ rating, onRate, readonly = false }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate(star)}
          className={`text-2xl transition-colors ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${!readonly && 'hover:text-yellow-400'}`}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <PageFadeIn>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">💬 {translate('communityFeedback')}</h1>
            <p className="text-gray-600 mt-1">{translate('helpImproveTransit')}</p>
          </div>

          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{translate('feedbackSubmitted')}</span>
            </div>
          )}

          {showError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {!isServiceAvailable && (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔌</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Unavailable</h3>
              <p className="text-gray-600">We're experiencing technical difficulties. Please try again later.</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'submit', label: translate('submitFeedback'), icon: '✍' },
                  { id: 'community', label: translate('viewFeedback'), icon: '💬' },
                  { id: 'my-feedback', label: translate('mySubmissions'), icon: '📄' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="route-input" className="block text-sm font-medium text-gray-700 mb-2">Route/Bus Number</label>
                    <input
                      type="text"
                      id="route-input"
                      value={formData.route}
                      onChange={e => setFormData(prev => ({ ...prev, route: e.target.value }))}
                      placeholder="e.g., 12A, 24X"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      id="priority-select"
                      value={formData.priority}
                      onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.type === 'rating' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                    <StarRating rating={rating} onRate={setRating} />
                  </div>
                )}

                <div>
                  <label htmlFor="title-input" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    id="title-input"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of your feedback"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description-textarea" className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                  <textarea
                    id="description-textarea"
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide as much detail as possible..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={e => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Submit anonymously</span>
                  </label>

                  {!formData.anonymous && (
                    <div>
                      <label htmlFor="contact-input" className="block text-sm font-medium text-gray-700 mb-2">Contact Information (Optional)</label>
                      <input
                        id="contact-input"
                        type="email"
                        value={formData.contact}
                        onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </form>
              </div>
            )}
          {activeTab === 'community' && (
            <div className="space-y-6">
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
                    All Feedback
                  </button>
                  {feedbackTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        filterType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredFeedback.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{feedbackTypes.find(t => t.value === item.type)?.icon}</span>
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
                          {item.status}
                        </span>
                      </div>
                    </div>

                  {item.rating > 0 && (
                    <div className="mb-3">
                    <StarRating rating={item.rating} readonly />
                   </div>
                )}


                    <p className="text-gray-700 mb-4">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleUpvote(item.id)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        {item.upvotes || 0} upvotes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'my-feedback' && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              {user ? (
                <div className="space-y-4">
                  {mySubmissions.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 text-left">
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Submission History</h3>
                  <p className="text-gray-600">Sign in to view your feedback history.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageFadeIn>
  );
}