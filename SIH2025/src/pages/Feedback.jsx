import { useState, useEffect } from 'react';
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
  const [user, setUser] = useState({ displayName: 'Guest User', email: 'guest@example.com' });
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);

  // Load feedback from backend
  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/feedback');
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
        setIsServiceAvailable(true);
        setShowError(false);
      } else {
        throw new Error('Failed to load feedback');
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      setIsServiceAvailable(false);
      setShowError(true);
      setErrorMessage('Service is currently unavailable. Please try again later.');
      // Use mock data when backend is unavailable
      setFeedback([]);
    }
  };

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
        rating: formData.type === 'rating' ? rating : 0,
        upvotes: 0,
        status: 'submitted',
        timestamp: new Date().toISOString(),
        author: formData.anonymous ? 'Anonymous' : user ? user.displayName || user.email : 'User'
      };

      const response = await fetch('http://localhost:4001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Feedback submitted successfully:', result);
        // Reload feedback list
        loadFeedback();
      } else {
        throw new Error('Failed to submit feedback');
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
      const response = await fetch(`http://localhost:4001/api/feedback/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Feedback upvoted successfully');
        // Reload feedback list
        loadFeedback();
      } else {
        throw new Error('Failed to upvote feedback');
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
  const date = new Date(timestamp);
  const diff = Date.now() - date.getTime();
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
                    <button
                      key={type.value}
                      onClick={() => setFilterType(type.value)}
                      className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${filterType === type.value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                    >
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
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
          )}
        </div>
      </div>
    </PageFadeIn>
  );
}