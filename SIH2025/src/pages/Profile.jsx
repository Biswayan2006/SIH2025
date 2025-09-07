import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const sampleUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+91 98765 43210',
  joinDate: '2024-01-15',
  avatar: '/api/placeholder/120/120',
  stats: {
    totalTrips: 247,
    totalDistance: 1850.5,
    co2Saved: 185.3,
    moneySaved: 3420
  }
}

const sampleRides = [
  {
    id: 1,
    route: '12A',
    from: 'Central Station',
    to: 'Tech Park',
    date: '2024-08-29',
    time: '09:15 AM',
    fare: '₹25',
    co2Saved: '2.3 kg'
  },
  {
    id: 2,
    route: '24X',
    from: 'University Gate',
    to: 'Shopping Mall',
    date: '2024-08-28',
    time: '06:30 PM',
    fare: '₹20',
    co2Saved: '1.8 kg'
  },
  {
    id: 3,
    route: '36C',
    from: 'Airport Terminal',
    to: 'City Center',
    date: '2024-08-27',
    time: '02:45 PM',
    fare: '₹30',
    co2Saved: '3.1 kg'
  }
]

const sampleFavorites = [
  {
    id: 1,
    type: 'route',
    name: 'Home to Office',
    route: '12A',
    from: 'Central Station',
    to: 'Tech Park',
    frequency: 'Daily'
  },
  {
    id: 2,
    type: 'stop',
    name: 'University Gate',
    routes: ['24X', '15D', '42E'],
    nearby: 'Main Campus'
  },
  {
    id: 3,
    type: 'route',
    name: 'Weekend Shopping',
    route: '36C',
    from: 'Central Station',
    to: 'Shopping Mall',
    frequency: 'Weekly'
  }
]

export default function Profile() {
  const { translate } = useLanguage();
  const [activeTab, setActiveTab] = useState('rides')
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    dataSaver: false,
    locationTracking: true,
    pushAlerts: true,
    emailUpdates: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState(sampleUser)

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const tabs = [
    { id: 'rides', label: translate('myRides'), icon: '🚌', count: sampleRides.length },
    { id: 'favorites', label: translate('favorites'), icon: '⭐', count: sampleFavorites.length },
    { id: 'settings', label: translate('settings'), icon: '⚙️', count: null },
  ]

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container-modern section-spacing">
        {/* Profile Header */}
        <div className="card-modern p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 p-1 shadow-modern">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-gray-600">
                    {userInfo.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{userInfo.name}</h1>
                <p className="text-gray-600 mb-1">{userInfo.email}</p>
                <p className="text-gray-500 text-sm">Member since {new Date(userInfo.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{userInfo.stats.totalTrips}</div>
                <div className="text-sm text-gray-600">{translate('totalTrips')}</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{userInfo.stats.totalDistance}</div>
                <div className="text-sm text-gray-600">{translate('totalDistance')}</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{userInfo.stats.co2Saved}</div>
                <div className="text-sm text-gray-600">{translate('co2Saved')}</div>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">₹{userInfo.stats.moneySaved}</div>
                <div className="text-sm text-gray-600">{translate('moneySaved')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          {/* Desktop Tabs */}
          <div className="hidden sm:flex card-modern p-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-500'
                  }`}
                >
                  <span className="text-lg mb-1">{tab.icon}</span>
                  <span className="text-xs font-medium">{tab.label}</span>
                  {tab.count && (
                    <span className="absolute top-1 right-1/2 transform translate-x-1/2 text-xs bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* My Rides Tab */}
          {activeTab === 'rides' && (
            <div className="space-y-6">
              <div className="card-modern p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  🚌 {translate('myRides')}
                </h2>
                <div className="space-y-4">
                  {sampleRides.map((ride, index) => (
                    <div 
                      key={ride.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {ride.route}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{ride.from} → {ride.to}</div>
                          <div className="text-sm text-gray-500">{ride.date} • {ride.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{ride.fare}</div>
                        <div className="text-sm text-green-600">{ride.co2Saved} saved</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary w-full mt-6">
                  {translate('myRides')}
                </button>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="card-modern p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  ⭐ {translate('favorites')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {sampleFavorites.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover-lift animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                            {item.type === 'route' ? '🚌' : '📍'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.type === 'route' ? `Route ${item.route}` : `${item.routes.length} routes`}
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      {item.type === 'route' ? (
                        <div className="text-sm text-gray-600">
                          <p>{item.from} → {item.to}</p>
                          <p className="text-emerald-600 font-medium">{item.frequency}</p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          <p>Routes: {item.routes.join(', ')}</p>
                          <p>Near: {item.nearby}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="card-modern p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  ⚙️ {translate('settings')}
                </h2>
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🔔 {translate('notifications')}</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'notifications', label: translate('notifications'), desc: 'Receive app notifications' },
                        { key: 'pushAlerts', label: translate('pushAlerts'), desc: 'Bus arrival and delay alerts' },
                        { key: 'emailUpdates', label: translate('emailUpdates'), desc: 'Weekly summary and news' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div>
                            <div className="font-medium text-gray-800">{setting.label}</div>
                            <div className="text-sm text-gray-500">{setting.desc}</div>
                          </div>
                          <button
                            onClick={() => handleSettingChange(setting.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              settings[setting.key] ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* App Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 {translate('settings')}</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'darkMode', label: translate('darkMode'), desc: 'Switch to dark theme' },
                        { key: 'dataSaver', label: translate('dataSaver'), desc: 'Reduce data usage' },
                        { key: 'locationTracking', label: translate('locationTracking'), desc: 'Enable location services' }
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                          <div>
                            <div className="font-medium text-gray-800">{setting.label}</div>
                            <div className="text-sm text-gray-500">{setting.desc}</div>
                          </div>
                          <button
                            onClick={() => handleSettingChange(setting.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              settings[setting.key] ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 {translate('editProfile')}</h3>
                    <div className="space-y-3">
                      <button className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl font-medium transition-all duration-300 text-left">
                        📝 {translate('editProfile')}
                      </button>
                      <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-2xl font-medium transition-all duration-300 text-left">
                        🔒 {translate('cancel')}
                      </button>
                      <button className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-2xl font-medium transition-all duration-300 text-left">
                        📱 Export Data
                      </button>
                      <button className="w-full p-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-medium transition-all duration-300 text-left">
                        🚪 Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Spacing */}
        <div className="sm:hidden h-20"></div>
      </div>
    </div>
  )
}