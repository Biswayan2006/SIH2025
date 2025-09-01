import React, { useState, useEffect, useRef } from 'react'
import PageFadeIn from '../components/PageFadeIn'

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
  // Add smooth scrolling effect
  useEffect(() => {
    // Apply smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [ecoFriendlyMode, setEcoFriendlyMode] = useState(false)
  const [isPlanning, setIsPlanning] = useState(false)
  const [routeResult, setRouteResult] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState({ from: false, to: false })
  const [searchQuery, setSearchQuery] = useState('')
  const [showSmartSchedule, setShowSmartSchedule] = useState(false)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const searchRef = useRef(null)

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

  // Enhanced search functionality
  const filteredRoutes = sampleRoutes.filter(route => {
    if (!route) return false;
    
    const matchesQuery = (query === '' && searchQuery === '') || 
      (route.name && route.name.toLowerCase().includes(query.toLowerCase())) ||
      (route.id && route.id.toLowerCase().includes(query.toLowerCase())) ||
      (route.from && route.from.toLowerCase().includes(query.toLowerCase())) ||
      (route.to && route.to.toLowerCase().includes(query.toLowerCase())) ||
      (route.name && route.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.id && route.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.from && route.from.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.to && route.to.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.features && Array.isArray(route.features) && route.features.some(feature => feature && feature.toLowerCase().includes(searchQuery.toLowerCase())))
    
    const matchesFilter = selectedFilter === 'all' || 
      route.type === selectedFilter ||
      route.status === selectedFilter
    
    return matchesQuery && matchesFilter
  })
  
  // Smart schedule helper function
  const getScheduleForDay = (day) => {
    return {
      morning: filteredRoutes.filter(route => route.nextDeparture.includes('min')).slice(0, 3),
      afternoon: filteredRoutes.filter(route => route.type !== 'night').slice(0, 3),
      evening: filteredRoutes.filter(route => route.type !== 'night').slice(0, 3),
      night: filteredRoutes.filter(route => route.type === 'night' || (route.features && route.features.includes('Security'))).slice(0, 2)
    }
  }

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
    <PageFadeIn>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <div className="container-modern section-spacing">
        {/* Hero Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-emerald-500">
            Smart Route Planner
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Plan your journey with <span className="text-blue-600 font-medium">AI-powered</span> predictions and <span className="text-emerald-500 font-medium">eco-friendly</span> route options
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="relative flex items-center max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search routes, destinations, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchRef}
              className="w-full py-4 px-6 bg-white rounded-full shadow-lg border-2 border-transparent focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 outline-none"
            />
            <button 
              className="absolute right-2 p-3 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full text-white hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              onClick={() => searchRef.current.focus()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Smart Schedule Toggle */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowSmartSchedule(!showSmartSchedule)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            {showSmartSchedule ? '🗓️ Hide Smart Schedule' : '🗓️ Show Smart Schedule'}
          </button>
        </div>

        {/* Smart Schedule */}
        {showSmartSchedule && (
          <div className="mb-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center">Smart Schedule for {selectedDay}</h2>
            
            {/* Day Selector */}
            <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    selectedDay === day 
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
            
            {/* Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Morning */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                  <span>☀️</span> Morning (6AM - 11AM)
                </h3>
                <div className="space-y-2">
                  {getScheduleForDay(selectedDay).morning.map((route, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">
                        {route.from} → {route.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Afternoon */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                <h3 className="font-medium text-yellow-800 mb-3 flex items-center gap-2">
                  <span>🌤️</span> Afternoon (11AM - 4PM)
                </h3>
                <div className="space-y-2">
                  {getScheduleForDay(selectedDay).afternoon.map((route, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">
                        {route.from} → {route.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Evening */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <h3 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                  <span>🌆</span> Evening (4PM - 8PM)
                </h3>
                <div className="space-y-2">
                  {getScheduleForDay(selectedDay).evening.map((route, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">
                        {route.from} → {route.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Night */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <h3 className="font-medium text-indigo-800 mb-3 flex items-center gap-2">
                  <span>🌙</span> Night (8PM - 6AM)
                </h3>
                <div className="space-y-2">
                  {getScheduleForDay(selectedDay).night && getScheduleForDay(selectedDay).night.map((route, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="font-medium">{route.name}</div>
                      <div className="text-sm text-gray-500">
                        {route.from} → {route.to}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Route Planning Form */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">Plan Your Route</h2>
          
          <form onSubmit={handlePlanRoute} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* From Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onFocus={() => setShowSuggestions({ ...showSuggestions, from: true })}
                    onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, from: false }), 200)}
                    placeholder="   Enter starting point..."
                    className="input-modern pl-12 rounded-full w-full py-3 px-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                </div>

                {/* Suggestions */}
                {showSuggestions.from && (
                  <div className="absolute top-full mt-2 w-full glass rounded-2xl shadow-glass overflow-hidden z-50">
                    {popularDestinations.map((dest, index) => (
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
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    onFocus={() => setShowSuggestions({ ...showSuggestions, to: true })}
                    onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, to: false }), 200)}
                    placeholder="   Enter destination..."
                    className="input-modern pl-12 rounded-full w-full py-3 px-4 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
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
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm mt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl shadow-sm">
                  🌱
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800">Eco-Friendly Mode</h3>
                  <p className="text-sm text-emerald-600">Prioritize routes with lower carbon footprint</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={ecoFriendlyMode}
                  onChange={() => setEcoFriendlyMode(!ecoFriendlyMode)}
                  className="sr-only peer" 
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPlanning}
              className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
            >
              {isPlanning ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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

        {/* Routes Grid */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-emerald-500">Available Routes</h2>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedFilter === 'all' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedFilter('active')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedFilter === 'active' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setSelectedFilter('express')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedFilter === 'express' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Express
              </button>
              <button 
                onClick={() => setSelectedFilter('eco')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedFilter === 'eco' 
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Eco-Friendly
              </button>
            </div>
          </div>
          
          <div className="grid-responsive gap-6">
            {filteredRoutes.map((route, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(route.type)}</span>
                      <h3 className="font-bold">{route.name}</h3>
                    </div>
                    <span className="text-sm font-medium px-3 py-1 bg-white/20 rounded-full">
                      {route.id}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-medium">{route.from}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{route.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-medium">{route.to}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Fare</div>
                      <div className="font-medium">{route.fare}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Frequency</div>
                      <div className="font-medium">{route.frequency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Next</div>
                      <div className="font-medium">{route.nextDeparture}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">Crowd:</span>
                      <span className={getCrowdColor(route.crowdPrediction)}>
                        {route.crowdPrediction && route.crowdPrediction.charAt(0).toUpperCase() + route.crowdPrediction.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">Eco Score:</span>
                      <span className={`font-medium ${
                        route.ecoScore > 90 ? 'text-green-600' : 
                        route.ecoScore > 80 ? 'text-green-500' : 
                        route.ecoScore > 70 ? 'text-yellow-600' : 'text-red-500'
                      }`}>
                        {route.ecoScore}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {route.features && route.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    className="w-full text-sm rounded-full shadow-sm transition-all duration-300 hover:shadow-md py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-medium"
                  >
                    📍 Track Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageFadeIn>
  )
}