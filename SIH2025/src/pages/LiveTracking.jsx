import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useLanguage } from '../context/LanguageContext'

const sampleBuses = [
  { 
    id: 'B-12A', 
    lat: 28.6139, 
    lng: 77.2090, 
    crowd: 'low', 
    route: '12A',
    nextStop: 'Central Station',
    eta: '3 min',
    reliability: 94,
    speed: 25,
    occupancy: 30,
    capacity: 60,
    lastUpdated: new Date()
  },
  { 
    id: 'B-24X', 
    lat: 28.6239, 
    lng: 77.2190, 
    crowd: 'medium', 
    route: '24X',
    nextStop: 'Mall Junction',
    eta: '7 min',
    reliability: 89,
    speed: 18,
    occupancy: 45,
    capacity: 60,
    lastUpdated: new Date()
  },
  { 
    id: 'B-36C', 
    lat: 28.6339, 
    lng: 77.1990, 
    crowd: 'high', 
    route: '36C',
    nextStop: 'Airport Terminal',
    eta: '12 min',
    reliability: 92,
    speed: 32,
    occupancy: 55,
    capacity: 60,
    lastUpdated: new Date()
  },
  { 
    id: 'B-15D', 
    lat: 28.6089, 
    lng: 77.2150, 
    crowd: 'low', 
    route: '15D',
    nextStop: 'University Gate',
    eta: '5 min',
    reliability: 96,
    speed: 22,
    occupancy: 20,
    capacity: 60,
    lastUpdated: new Date()
  }
]

const sampleRoute = [
  [28.6139, 77.2090],
  [28.6189, 77.2140],
  [28.6239, 77.2190],
  [28.6289, 77.2240],
  [28.6339, 77.2290]
]

const nearbyStops = [
  { name: 'Central Station', eta: '3 min', crowd: 'medium', buses: ['12A', '24X'] },
  { name: 'Mall Junction', eta: '7 min', crowd: 'low', buses: ['12A', '15D'] },
  { name: 'University Gate', eta: '12 min', crowd: 'high', buses: ['24X', '36C'] },
  { name: 'Airport Terminal', eta: '18 min', crowd: 'medium', buses: ['36C'] },
  { name: 'Tech Park', eta: '25 min', crowd: 'low', buses: ['15D'] }
]

function crowdColor(level) {
  const colors = {
    low: '#10b981',    // Green
    medium: '#f59e0b', // Yellow/Orange  
    high: '#ef4444'    // Red
  }
  return colors[level] || '#6b7280'
}

function crowdIcon(level) {
  const icons = {
    low: '🟢',
    medium: '🟡', 
    high: '🔴'
  }
  return icons[level] || '⚪'
}

function BusMarker({ bus, isSelected, onClick }) {
  return (
    <CircleMarker
      center={[bus.lat, bus.lng]}
      radius={isSelected ? 12 : 8}
      pathOptions={{
        color: isSelected ? '#ffffff' : crowdColor(bus.crowd),
        fillColor: crowdColor(bus.crowd),
        fillOpacity: 0.8,
        weight: isSelected ? 3 : 2
      }}
      eventHandlers={{
        click: () => onClick(bus)
      }}
    >
      <Popup>
        <div className="p-2 min-w-48">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold">{bus.id}</span>
            <span className="status-indicator status-green text-xs">Route {bus.route}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Next Stop:</span>
              <span className="font-medium">{bus.nextStop}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ETA:</span>
              <span className="font-medium text-emerald-600">{bus.eta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Occupancy:</span>
              <span className={`font-medium ${bus.crowd === 'low' ? 'text-green-600' : bus.crowd === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                {Math.round((bus.occupancy / bus.capacity) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  )
}

export default function LiveTracking() {
  const { translate } = useLanguage()
  const [selectedBus, setSelectedBus] = useState(sampleBuses[0])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile-first: closed by default
  const [filterCrowd, setFilterCrowd] = useState('all')
  const [buses, setBuses] = useState(sampleBuses)
  const [searchQuery, setSearchQuery] = useState('')
  const mapRef = useRef()
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Desktop sidebar open by default
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isOnline) return
    
    const interval = setInterval(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
          lastUpdated: new Date()
        }))
      )
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isOnline])
  
  const filteredBuses = filterCrowd === 'all' ? buses : buses.filter(bus => bus.crowd === filterCrowd)
  
  return (
    <div className="min-h-screen bg-soft">
      {/* Status Banner */}
      {!isOnline && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 glass rounded-2xl px-6 py-3 shadow-glass border border-yellow-300">
          <div className="flex items-center gap-3 text-yellow-800">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="font-medium">{translate('offlineMode')}</span>
          </div>
        </div>
      )}
      
      <div className="container-modern section-spacing">
        {/* Modern Header */}
        <div className="card-modern p-6 mb-6 shadow-glass">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                🎯 {translate('liveBusTracking')}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse-modern' : 'bg-yellow-500'}`}></div>
                  {isOnline ? translate('live') : translate('offline')}
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                {translate('trackBusesDescription')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={translate('searchRoutesStops')}
                  className="input-modern w-full sm:w-64 rounded-full pl-10"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Filter Dropdown */}
              <select 
                value={filterCrowd} 
                onChange={(e) => setFilterCrowd(e.target.value)}
                className="input-modern rounded-full px-4 py-2 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              >
                <option value="all">{translate('allCrowds')}</option>
                <option value="low">🟢 {translate('seatsAvailable')}</option>
                <option value="medium">🟡 {translate('moderate')}</option>
                <option value="high">🔴 {translate('crowded')}</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Map Section */}
          <div className="card-modern overflow-hidden shadow-card rounded-2xl">
            <div className="h-[60vh] lg:h-[80vh] relative">
              <MapContainer 
                ref={mapRef}
                center={[28.6139, 77.209]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-3xl"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Route Line */}
                <Polyline 
                  positions={sampleRoute} 
                  pathOptions={{ 
                    color: '#10b981', 
                    weight: 4, 
                    opacity: 0.8,
                    dashArray: '10, 10'
                  }} 
                />
                
                {/* Bus Markers */}
                {filteredBuses.map((bus) => (
                  <BusMarker
                    key={bus.id}
                    bus={bus}
                    isSelected={selectedBus?.id === bus.id}
                    onClick={setSelectedBus}
                  />
                ))}
              </MapContainer>
              
              {/* Map Controls */}
              <div className="absolute top-4 left-4 space-y-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden glass rounded-full p-3 shadow-glass hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4">
                <div className="glass rounded-2xl p-4 space-y-2 shadow-glass">
                  <div className="text-sm font-medium text-gray-700 mb-2">Crowd Levels</div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Seats Available</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Moderate</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Crowded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="card-modern p-6 shadow-card rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Live Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-2xl transition-all duration-300 hover:shadow-sm">
                    <div className="text-2xl font-bold text-emerald-600">{filteredBuses.length}</div>
                    <div className="text-sm text-gray-600">Active Buses</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-2xl transition-all duration-300 hover:shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(filteredBuses.reduce((acc, bus) => acc + bus.speed, 0) / filteredBuses.length)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Speed</div>
                  </div>
                </div>
              </div>
              
              {/* Nearby Stops */}
              <div className="card-modern p-6 shadow-card rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🚏 Nearby Stops</h3>
                <div className="space-y-3">
                  {nearbyStops.slice(0, 4).map((stop, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{stop.name}</span>
                        <span className="text-emerald-600 font-bold text-sm">{stop.eta}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {crowdIcon(stop.crowd)}
                          <span className="text-sm text-gray-600 capitalize">{stop.crowd}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Routes: {stop.buses.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selected Bus Details */}
              {selectedBus && (
                <div className="card-modern p-6 shadow-card rounded-2xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    🚌 Bus Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-2xl text-center transition-all duration-300 hover:shadow-sm">
                        <div className="text-sm text-gray-600">Bus ID</div>
                        <div className="font-bold text-lg">{selectedBus.id}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl text-center transition-all duration-300 hover:shadow-sm">
                        <div className="text-sm text-gray-600">Route</div>
                        <div className="font-bold text-lg text-emerald-600">{selectedBus.route}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Next Stop</span>
                        <span className="font-medium">{selectedBus.nextStop}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">ETA</span>
                        <span className="font-bold text-emerald-600">{selectedBus.eta}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Speed</span>
                        <span className="font-medium">{selectedBus.speed} km/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Reliability</span>
                        <span className="font-medium">{selectedBus.reliability}%</span>
                      </div>
                    </div>
                    
                    {/* Occupancy Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Occupancy</span>
                        <span className="font-medium">{selectedBus.occupancy}/{selectedBus.capacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            selectedBus.crowd === 'low' ? 'bg-green-500' : 
                            selectedBus.crowd === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(selectedBus.occupancy / selectedBus.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button className="btn-primary w-full mt-4 rounded-full">
                      📍 Set Pickup Alert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}