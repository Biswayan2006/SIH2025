import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const fleetData = [
  { id: 'B-12A', route: '12A', lat: 28.6139, lng: 77.2090, status: 'active', passengers: 28, capacity: 45, delay: 2, driver: 'John Doe', lastUpdate: new Date() },
  { id: 'B-24X', route: '24X', lat: 28.6239, lng: 77.2190, status: 'active', passengers: 42, capacity: 50, delay: -1, driver: 'Jane Smith', lastUpdate: new Date() },
  { id: 'B-36C', route: '36C', lat: 28.6339, lng: 77.1990, status: 'maintenance', passengers: 0, capacity: 40, delay: 0, driver: '', lastUpdate: new Date() },
  { id: 'B-15D', route: '15D', lat: 28.6089, lng: 77.2150, status: 'active', passengers: 15, capacity: 35, delay: 5, driver: 'Mike Johnson', lastUpdate: new Date() },
  { id: 'B-08B', route: '08B', lat: 28.6189, lng: 77.2090, status: 'offline', passengers: 0, capacity: 45, delay: 0, driver: '', lastUpdate: new Date() }
]

const analyticsData = {
  overview: {
    totalBuses: 15,
    activeBuses: 12,
    totalRoutes: 8,
    avgDelay: 3.2,
    totalPassengers: 1247,
    co2Saved: 2456.8
  },
  routes: [
    { id: '12A', name: 'City Center Express', popularity: 95, avgDelay: 2.1, efficiency: 92 },
    { id: '24X', name: 'Tech Park Shuttle', popularity: 87, avgDelay: 1.8, efficiency: 89 },
    { id: '36C', name: 'Mall Circuit', popularity: 78, avgDelay: 4.2, efficiency: 76 },
    { id: '15D', name: 'Hospital Route', popularity: 82, avgDelay: 3.5, efficiency: 81 }
  ]
}

const feedbackSummary = [
  { type: 'issue', count: 23, trend: 'up', change: 8 },
  { type: 'suggestion', count: 15, trend: 'down', change: -3 },
  { type: 'compliment', count: 47, trend: 'up', change: 12 },
  { type: 'rating', count: 89, trend: 'stable', change: 1 }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedBus, setSelectedBus] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'delay', message: 'Route 36C experiencing 5+ min delays', severity: 'high', time: '2 min ago' },
    { id: 2, type: 'maintenance', message: 'Bus B-36C scheduled for maintenance', severity: 'medium', time: '15 min ago' },
    { id: 3, type: 'feedback', message: '3 new high-priority feedback items', severity: 'low', time: '1 hour ago' }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'maintenance': return '#f59e0b'
      case 'offline': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getCrowdLevel = (passengers, capacity) => {
    const ratio = passengers / capacity
    if (ratio < 0.5) return { level: 'low', color: '#10b981' }
    if (ratio < 0.8) return { level: 'medium', color: '#f59e0b' }
    return { level: 'high', color: '#ef4444' }
  }

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                🚌 Admin Dashboard
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Live
                </span>
              </h1>
              <p className="text-gray-600 mt-1">Fleet monitoring, analytics, and system management</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
                alert.severity === 'high' ? 'bg-red-50 border-red-500' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {alert.type === 'delay' ? '⏰' : 
                     alert.type === 'maintenance' ? '🔧' : '💬'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{alert.message}</div>
                    <div className="text-sm text-gray-600">{alert.time}</div>
                  </div>
                </div>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'fleet', label: 'Fleet Monitor', icon: '🚌' },
                { id: 'analytics', label: 'Analytics', icon: '📈' },
                { id: 'feedback', label: 'Feedback', icon: '💬' }
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
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Total Buses</div>
                    <div className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalBuses}</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl">
                    🚌
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Active Now</div>
                    <div className="text-2xl font-bold text-green-600">{analyticsData.overview.activeBuses}</div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl">
                    ✅
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Routes</div>
                    <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.totalRoutes}</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl">
                    🗺️
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Avg Delay</div>
                    <div className="text-2xl font-bold text-yellow-600">{analyticsData.overview.avgDelay}m</div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-2xl">
                    ⏱️
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Passengers</div>
                    <div className="text-2xl font-bold text-indigo-600">{analyticsData.overview.totalPassengers}</div>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-2xl">
                    👥
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">CO₂ Saved</div>
                    <div className="text-2xl font-bold text-emerald-600">{analyticsData.overview.co2Saved}kg</div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-2xl">
                    🌱
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-2xl mb-2">🚨</div>
                  <div className="font-medium text-gray-800">Emergency Alert</div>
                  <div className="text-sm text-gray-600">Send system-wide alerts</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-medium text-gray-800">Schedule Maintenance</div>
                  <div className="text-sm text-gray-600">Plan bus maintenance</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-medium text-gray-800">Route Planning</div>
                  <div className="text-sm text-gray-600">Optimize routes</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-medium text-gray-800">Staff Management</div>
                  <div className="text-sm text-gray-600">Manage drivers & staff</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Fleet Monitor Tab */}
        {activeTab === 'fleet' && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="h-[600px] relative">
                <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {fleetData.map((bus) => (
                    <CircleMarker 
                      key={bus.id} 
                      center={[bus.lat, bus.lng]} 
                      radius={10}
                      pathOptions={{ 
                        color: getStatusColor(bus.status),
                        fillColor: getStatusColor(bus.status),
                        fillOpacity: 0.8,
                        weight: 3
                      }}
                      eventHandlers={{
                        click: () => setSelectedBus(bus)
                      }}
                    >
                      <Popup>
                        <div className="text-sm space-y-1">
                          <div className="font-bold">{bus.id}</div>
                          <div>{translate('route')}: {bus.route}</div>
                          <div>Status: {bus.status}</div>
                          <div>Passengers: {bus.passengers}/{bus.capacity}</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Fleet List */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fleet Status</h3>
                <div className="space-y-3">
                  {fleetData.map((bus) => {
                    const crowd = getCrowdLevel(bus.passengers, bus.capacity)
                    return (
                      <div 
                        key={bus.id}
                        onClick={() => setSelectedBus(bus)}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-800">{bus.id}</div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            bus.status === 'active' ? 'bg-green-100 text-green-800' :
                            bus.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {bus.status}
                          </div>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          <div>Route: {bus.route}</div>
                          {bus.status === 'active' && (
                            <>
                              <div>Passengers: {bus.passengers}/{bus.capacity}</div>
                              <div className="flex items-center gap-2">
                                <span>Crowd:</span>
                                <span 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: crowd.color }}
                                ></span>
                                <span className="capitalize">{crowd.level}</span>
                              </div>
                              {bus.delay !== 0 && (
                                <div className={`${bus.delay > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {bus.delay > 0 ? `+${bus.delay}` : bus.delay} min
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Selected Bus Details */}
              {selectedBus && (
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Bus Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ID:</span> {selectedBus.id}</div>
                    <div><span className="font-medium">Route:</span> {selectedBus.route}</div>
                    <div><span className="font-medium">Status:</span> {selectedBus.status}</div>
                    {selectedBus.driver && (
                      <div><span className="font-medium">Driver:</span> {selectedBus.driver}</div>
                    )}
                    <div><span className="font-medium">Capacity:</span> {selectedBus.passengers}/{selectedBus.capacity}</div>
                    <div><span className="font-medium">Last Update:</span> {selectedBus.lastUpdate.toLocaleTimeString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Route Performance</h3>
              <div className="space-y-4">
                {analyticsData.routes.map((route) => (
                  <div key={route.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-800">{route.id}</div>
                        <div className="text-sm text-gray-600">{route.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Efficiency</div>
                        <div className="text-lg font-semibold text-blue-600">{route.efficiency}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Popularity</div>
                        <div className="font-medium">{route.popularity}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${route.popularity}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-500">Avg Delay</div>
                        <div className="font-medium">{route.avgDelay}m</div>
                      </div>
                      
                      <div>
                        <div className="text-gray-500">Efficiency</div>
                        <div className="font-medium">{route.efficiency}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {feedbackSummary.map((item) => (
                <div key={item.type} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl">
                      {item.type === 'issue' ? '⚠️' :
                       item.type === 'suggestion' ? '💡' :
                       item.type === 'compliment' ? '😊' : '⭐'}
                    </div>
                    <div className={`text-sm font-medium ${
                      item.trend === 'up' ? 'text-red-600' :
                      item.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'} {Math.abs(item.change)}
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-gray-800 mb-1">{item.count}</div>
                  <div className="text-sm text-gray-600 capitalize">{item.type}s</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h3>
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p>Feedback management interface would be displayed here</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View All Feedback
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}