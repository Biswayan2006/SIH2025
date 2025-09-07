import { useState, useEffect } from 'react'

const sampleRoutes = [
  {
    id: '12A',
    name: 'City Center Express',
    from: 'Airport Terminal',
    to: 'Central Station',
    stops: 15,
    duration: '45 min',
    frequency: '10 min',
    fare: '₹25',
    status: 'active',
    type: 'express',
    features: ['AC', 'WiFi', 'GPS'],
    crowdPrediction: 'low',
    ecoScore: 95,
    nextDeparture: '8 min'
  },
  {
    id: '24X',
    name: 'Tech Park Shuttle',
    from: 'University Gate',
    to: 'Tech Park',
    stops: 12,
    duration: '35 min',
    frequency: '15 min',
    fare: '₹20',
    status: 'active',
    type: 'regular',
    features: ['AC', 'GPS'],
    crowdPrediction: 'medium',
    ecoScore: 88,
    nextDeparture: '12 min'
  },
  {
    id: '36C',
    name: 'Mall Circuit',
    from: 'Central Station',
    to: 'Shopping Mall',
    stops: 8,
    duration: '25 min',
    frequency: '12 min',
    fare: '₹15',
    status: 'active',
    type: 'regular',
    features: ['GPS'],
    crowdPrediction: 'high',
    ecoScore: 82,
    nextDeparture: '5 min'
  },
  {
    id: '15D',
    name: 'Hospital Route',
    from: 'Medical College',
    to: 'City Hospital',
    stops: 18,
    duration: '50 min',
    frequency: '20 min',
    fare: '₹22',
    status: 'active',
    type: 'regular',
    features: ['AC', 'WiFi', 'GPS'],
    crowdPrediction: 'low',
    ecoScore: 91,
    nextDeparture: '18 min'
  },
  {
    id: '08B',
    name: 'Night Service',
    from: 'Airport Terminal',
    to: 'City Center',
    stops: 10,
    duration: '40 min',
    frequency: '30 min',
    fare: '₹30',
    status: 'limited',
    type: 'night',
    features: ['AC', 'Security', 'GPS'],
    crowdPrediction: 'low',
    ecoScore: 94,
    nextDeparture: '25 min'
  },
  {
    id: '42E',
    name: 'University Link',
    from: 'Main Campus',
    to: 'Research Center',
    stops: 6,
    duration: '20 min',
    frequency: '8 min',
    fare: '₹12',
    status: 'active',
    type: 'campus',
    features: ['WiFi', 'GPS'],
    crowdPrediction: 'medium',
    ecoScore: 86,
    nextDeparture: '3 min'
  }
]

const popularDestinations = [
  { name: 'Central Station', icon: '🚉' },
  { name: 'Airport Terminal', icon: '✈️' },
  { name: 'Tech Park', icon: '💼' },
  { name: 'University Gate', icon: '🎓' },
  { name: 'Shopping Mall', icon: '🛍️' },
  { name: 'City Hospital', icon: '🏥' }
]

export default function RoutePlanner() {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [ecoFriendlyMode, setEcoFriendlyMode] = useState(false)
  const [isPlanning, setIsPlanning] = useState(false)
  const [routeResult, setRouteResult] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState({ from: false, to: false })

  const handlePlanRoute = async (e) => {
    e.preventDefault()
    if (!fromLocation.trim() || !toLocation.trim()) return
    
    setIsPlanning(true)
    
    // Simulate route planning
    setTimeout(() => {
      const bestRoute = sampleRoutes.find(route => 
        route.from.toLowerCase().includes(fromLocation.toLowerCase()) ||
        route.to.toLowerCase().includes(toLocation.toLowerCase())
      ) || sampleRoutes[0]
      
      setRouteResult({
        route: bestRoute,
        totalTime: bestRoute.duration,
        totalFare: bestRoute.fare,
        co2Saved: ecoFriendlyMode ? '2.5 kg' : '1.8 kg',
        alternatives: sampleRoutes.slice(1, 3)
      })
      setIsPlanning(false)
    }, 2000)
  }

  const filteredRoutes = sampleRoutes.filter(route => {
    const matchesQuery = query === '' || 
      route.name.toLowerCase().includes(query.toLowerCase()) ||
      route.id.toLowerCase().includes(query.toLowerCase()) ||
      route.from.toLowerCase().includes(query.toLowerCase()) ||
      route.to.toLowerCase().includes(query.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || 
      route.type === selectedFilter ||
      route.status === selectedFilter
    
    return matchesQuery && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-green'
      case 'limited': return 'status-yellow'
      case 'maintenance': return 'status-red'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'express': return '🚅'
      case 'night': return '🌙'
      case 'campus': return '🏫'
      default: return '🚌'
    }
  }

  const getCrowdColor = (crowd) => {
    switch (crowd) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-soft">
      <div className="container-modern section-spacing">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Smart Route Planner
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Plan your journey with AI-powered predictions and eco-friendly route options
          </p>
        </div>

        {/* Route Planning Form */}
        <div className="card-modern p-8 mb-8 animate-fade-in-up shadow-card rounded-2xl">
          <form onSubmit={handlePlanRoute} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* From Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🚩 From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onFocus={() => setShowSuggestions({ ...showSuggestions, from: true })}
                    onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, from: false }), 200)}
                    placeholder="Enter pickup location..."
                    className="input-modern pl-12 rounded-full"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Suggestions */}
                {showSuggestions.from && (
                  <div className="absolute top-full mt-2 w-full glass rounded-2xl shadow-glass overflow-hidden z-50">
                    {popularDestinations.slice(0, 4).map((dest, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFromLocation(dest.name)}
                        className="w-full text-left px-4 py-3 hover:bg-white/50 flex items-center gap-3 transition-all duration-300"
                      >
                        <span className="text-lg">{dest.icon}</span>
                        <span className="font-medium">{dest.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    onFocus={() => setShowSuggestions({ ...showSuggestions, to: true })}
                    onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, to: false }), 200)}
                    placeholder="Enter destination..."
                    className="input-modern pl-12 rounded-full"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                </div>

                {/* Suggestions */}
                {showSuggestions.to && (
                  <div className="absolute top-full mt-2 w-full glass rounded-2xl shadow-glass overflow-hidden z-50">
                    {popularDestinations.slice(0, 4).map((dest, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setToLocation(dest.name)}
                        className="w-full text-left px-4 py-3 hover:bg-white/50 flex items-center gap-3 transition-all duration-300"
                      >
                        <span className="text-lg">{dest.icon}</span>
                        <span className="font-medium">{dest.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Eco Toggle */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl shadow-sm">
                  🌱
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">Eco-Friendly Routes</h3>
                  <p className="text-sm text-emerald-600">Prioritize buses with lower carbon impact</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ecoFriendlyMode}
                  onChange={(e) => setEcoFriendlyMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                <span className="ml-2 text-sm font-medium text-gray-700 transition-colors duration-300 peer-checked:text-emerald-600">
                  {ecoFriendlyMode ? 'On' : 'Off'}
                </span>
              </label>
            </div>

            {/* Plan Button */}
            <button
              type="submit"
              disabled={isPlanning || !fromLocation.trim() || !toLocation.trim()}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 rounded-full shadow-glass transition-all duration-300 hover:shadow-lg"
            >
              {isPlanning ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Planning Route...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Plan My Route
                </>
              )}
            </button>
          </form>
        </div>

        {/* Route Result */}
        {routeResult && (
          <div className="card-modern p-8 mb-8 animate-fade-in-up">
            <h2 className="text-section-title mb-6 flex items-center gap-2">
              🎯 Recommended Route
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Route Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl border border-emerald-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {getTypeIcon(routeResult.route.type)} {routeResult.route.name}
                      </h3>
                      <p className="text-gray-600">Route {routeResult.route.id}</p>
                    </div>
                    <span className={`status-indicator ${getStatusColor(routeResult.route.status)}`}>                      {routeResult.route.status}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white/70 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-card">
                      <div className="text-2xl font-bold text-emerald-600">{routeResult.totalTime}</div>
                      <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-card">
                      <div className="text-2xl font-bold text-blue-600">{routeResult.totalFare}</div>
                      <div className="text-sm text-gray-600">Fare</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-card">
                      <div className="text-2xl font-bold text-green-600">{routeResult.co2Saved}</div>
                      <div className="text-sm text-gray-600">CO₂ Saved</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Next departure:</span>
                      <span className="font-bold text-emerald-600">{routeResult.route.nextDeparture}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Crowd level:</span>
                      <span className={`font-medium ${getCrowdColor(routeResult.route.crowdPrediction)}`}>
                        {routeResult.route.crowdPrediction}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Alternative Routes */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Alternative Routes</h4>
                  <div className="space-y-3">
                    {routeResult.alternatives.map((route, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-card">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-800">{route.name}</span>
                            <span className="text-sm text-gray-600 ml-2">({route.duration})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">{route.fare}</span>
                            <span className={`text-sm ${getCrowdColor(route.crowdPrediction)}`}>
                              {route.crowdPrediction}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Action Panel */}
              <div className="space-y-4">
                <button className="btn-primary w-full rounded-full shadow-glass transition-all duration-300 hover:shadow-lg">
                  🚀 Start Journey
                </button>
                <button className="btn-secondary w-full rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                  📍 Set Reminder
                </button>
                <button className="btn-secondary w-full rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                  📤 Share Route
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Browse All Routes */}
        <div className="card-modern p-8 shadow-card rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-section-title font-bold text-gray-800">🚌 All Routes</h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search routes..."
                  className="input-modern pl-10 rounded-full"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="input-modern rounded-full"
              >
                <option value="all">All Types</option>
                <option value="express">Express</option>
                <option value="regular">Regular</option>
                <option value="night">Night</option>
                <option value="campus">Campus</option>
              </select>
            </div>
          </div>
          
          {/* Routes Grid */}
          <div className="grid-responsive">
            {filteredRoutes.map((route, index) => (
              <div 
                key={route.id} 
                className="p-6 bg-soft rounded-2xl shadow-card hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Route Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full shadow-sm flex items-center justify-center text-white text-xl">
                      {getTypeIcon(route.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{route.name}</h3>
                      <p className="text-sm text-gray-600">Route {route.id}</p>
                    </div>
                  </div>
                  <span className={`status-indicator ${getStatusColor(route.status)}`}>
                    {route.status}
                  </span>
                </div>
                
                {/* Route Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm bg-white/50 p-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                    <span className="text-gray-600">From:</span>
                    <span className="font-medium">{route.from}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm bg-white/50 p-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{route.to}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/50 p-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">{route.duration}</div>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                      <span className="text-gray-600">Fare:</span>
                      <div className="font-medium text-emerald-600">{route.fare}</div>
                    </div>
                    <div className="bg-white/50 p-2 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                      <span className="text-gray-600">Next:</span>
                      <div className="font-medium">{route.nextDeparture}</div>
                    </div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {route.features.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium shadow-sm transition-all duration-300 hover:shadow-md">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Action Button */}
                <button className="btn-secondary w-full text-sm rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
                  📍 Track Live
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}