import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion } from 'framer-motion'

// Custom marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Sample trip data
const sampleTrips = [
  {
    id: 'T-1001',
    route: '12A',
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    status: 'completed',
    passengers: 42,
    checkpoints: [
      { name: 'Central Station', time: '08:00 AM', status: 'completed' },
      { name: 'Market Square', time: '08:15 AM', status: 'completed' },
      { name: 'University', time: '08:30 AM', status: 'completed' },
      { name: 'Tech Park', time: '09:00 AM', status: 'completed' },
      { name: 'Mall Junction', time: '09:30 AM', status: 'completed' }
    ]
  },
  {
    id: 'T-1002',
    route: '24X',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    status: 'in-progress',
    passengers: 28,
    checkpoints: [
      { name: 'Airport Terminal', time: '10:00 AM', status: 'completed' },
      { name: 'Hotel District', time: '10:20 AM', status: 'completed' },
      { name: 'City Center', time: '10:40 AM', status: 'in-progress' },
      { name: 'Hospital', time: '11:00 AM', status: 'pending' },
      { name: 'Residential Area', time: '11:30 AM', status: 'pending' }
    ]
  },
  {
    id: 'T-1003',
    route: '36C',
    startTime: '01:00 PM',
    endTime: '02:30 PM',
    status: 'pending',
    passengers: 0,
    checkpoints: [
      { name: 'Bus Depot', time: '01:00 PM', status: 'pending' },
      { name: 'Shopping District', time: '01:20 PM', status: 'pending' },
      { name: 'Sports Complex', time: '01:40 PM', status: 'pending' },
      { name: 'Beach Road', time: '02:00 PM', status: 'pending' },
      { name: 'Tourist Center', time: '02:30 PM', status: 'pending' }
    ]
  }
]

// Location permission handler component
function LocationPermissionHandler({ onLocationUpdate }) {
  const [permissionStatus, setPermissionStatus] = useState('checking')
  const { translate } = useLanguage()
  
  useEffect(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('unsupported')
      return
    }
    
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
      setPermissionStatus(result.state)
      
      result.onchange = () => {
        setPermissionStatus(result.state)
      }
    })
  }, [])
  
  const requestPermission = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setPermissionStatus('granted')
        onLocationUpdate({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      error => {
        console.error('Error getting location:', error)
        setPermissionStatus('denied')
      }
    )
  }
  
  if (permissionStatus === 'checking') {
    return (
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
        <p className="text-blue-700 dark:text-blue-200">{translate('checking_location_permission')}</p>
      </div>
    )
  }
  
  if (permissionStatus === 'unsupported') {
    return (
      <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-4">
        <p className="text-red-700 dark:text-red-200">{translate('location_not_supported')}</p>
      </div>
    )
  }
  
  if (permissionStatus === 'denied') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-4">
        <p className="text-yellow-700 dark:text-yellow-200">{translate('location_permission_denied')}</p>
        <button 
          onClick={requestPermission}
          className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
        >
          {translate('request_permission')}
        </button>
      </div>
    )
  }
  
  if (permissionStatus === 'prompt') {
    return (
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
        <p className="text-blue-700 dark:text-blue-200">{translate('location_permission_required')}</p>
        <button 
          onClick={requestPermission}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {translate('enable_location')}
        </button>
      </div>
    )
  }
  
  return null
}

// QR Scanner component
function QRScanner({ isActive, onScan }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [scannerActive, setScannerActive] = useState(false)
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const { translate } = useLanguage()
  
  useEffect(() => {
    let stream = null
    let animationFrameId = null
    
    if (isActive && !scannerActive) {
      setScannerActive(true)
      setScanning(true)
      
      // Request camera access
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
          stream = mediaStream
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream
            videoRef.current.play()
            
            // Start scanning animation
            const scanInterval = setInterval(() => {
              if (scanning) {
                // Simulate processing frames
                const randomChance = Math.random();
                if (randomChance < 0.1) { // 10% chance of "finding" a QR code
                  handleSuccessfulScan();
                }
              }
            }, 1000); // Check every second
            
            return () => clearInterval(scanInterval);
          }
          setError(null)
        })
        .catch(err => {
          console.error('Error accessing camera:', err)
          setError('camera_access_error')
          setScannerActive(false)
          setScanning(false)
        })
    } else if (!isActive && scannerActive) {
      setScannerActive(false)
      setScanning(false)
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isActive, scannerActive])
  
  // Handle successful QR code scan
  const handleSuccessfulScan = () => {
    setScanning(false) // Pause scanning
    
    // Generate random ticket data
    const routes = ['12A', '24X', '36C', '48B', '52D']
    const randomRoute = routes[Math.floor(Math.random() * routes.length)]
    
    onScan({
      ticketId: 'T' + Math.floor(Math.random() * 10000),
      route: randomRoute,
      timestamp: new Date().toISOString(),
      valid: Math.random() > 0.1 // 90% chance of being valid
    })
  }
  
  // Manual scan button handler
  const handleManualScan = () => {
    handleSuccessfulScan()
  }
  
  if (error) {
    return (
      <motion.div 
        className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">{translate(error)}</p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="relative glass dark:glass-dark rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
      {scannerActive ? (
        <>
          <video 
            ref={videoRef} 
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50/30 to-cyan-50/30 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="w-56 h-56 border-2 border-cyan-500 rounded-lg relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-500"></div>
              {scanning && (
                <motion.div 
                  className="absolute inset-0 border-2 border-cyan-400 rounded-lg"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0.2 }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                />
              )}
            </div>
          </div>
          <button 
            onClick={handleManualScan}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {translate('scan_ticket')}
          </button>
        </>
      ) : (
        <div className="h-72 flex items-center justify-center bg-gradient-to-b from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-blue-500 border-dashed rounded-lg"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">{translate('camera_inactive')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs px-6">{translate('scan_instructions')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Live location map component
function LiveLocationMap({ location, locationEnabled }) {
  const [currentLocation, setCurrentLocation] = useState(location)
  const { translate } = useLanguage()
  
  useEffect(() => {
    if (location) {
      setCurrentLocation(location)
    }
  }, [location])
  
  // Update location periodically when enabled
  useEffect(() => {
    let watchId = null
    
    if (locationEnabled && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        error => {
          console.error('Error watching position:', error)
        },
        { enableHighAccuracy: true }
      )
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [locationEnabled])
  
  // Map click handler to simulate location changes (for testing)
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        if (locationEnabled) {
          setCurrentLocation({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          })
        }
      },
    })
    return null
  }
  
  if (!currentLocation) {
    return (
      <motion.div 
        className="glass dark:glass-dark rounded-xl p-6 flex items-center justify-center h-72 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-900/10 dark:to-transparent"></div>
        <div className="relative z-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">{translate('no_location_data')}</p>
          <div className="flex justify-center mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div 
      className="h-72 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-800/80 dark:to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-800/80 dark:to-transparent z-10 pointer-events-none"></div>
      <MapContainer 
        center={[currentLocation.lat, currentLocation.lng]} 
        zoom={15} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[currentLocation.lat, currentLocation.lng]}>
          <Popup className="rounded-lg shadow-lg">
            <div className="font-medium text-gray-800">{translate('current_location')}</div>
            <div className="text-sm text-gray-600 mt-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {new Date().toLocaleTimeString()}
            </div>
          </Popup>
        </Marker>
        <MapClickHandler />
      </MapContainer>
    </motion.div>
  )
}

// Checkpoint card component
function CheckpointCard({ checkpoint, isActive, onMarkComplete }) {
  const { translate } = useLanguage()
  const { darkMode } = useTheme()
  
  return (
    <motion.div 
      className={`p-4 rounded-xl mb-3 border transition-all duration-300 ${isActive ? 'border-blue-300 dark:border-blue-700 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30 shadow-md' : 
        checkpoint.status === 'completed' ? 'border-green-200 dark:border-green-700 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30' : 
        checkpoint.status === 'in-progress' ? 'border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30' : 
        'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${checkpoint.status === 'completed' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
              : checkpoint.status === 'in-progress' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'bg-gray-300 dark:bg-gray-600'}`}>
              {checkpoint.status === 'completed' && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h4 className="font-medium">{checkpoint.name}</h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-7">{checkpoint.time}</p>
        </div>
        {checkpoint.status === 'in-progress' && (
          <button 
            onClick={() => onMarkComplete(checkpoint.name)}
            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm rounded-full font-medium hover:shadow-md transition-all duration-300 transform hover:scale-105"
          >
            {translate('mark_complete')}
          </button>
        )}
        {checkpoint.status === 'completed' && (
          <span className="text-xs px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium">
            {translate('completed')}
          </span>
        )}
        {checkpoint.status === 'pending' && (
          <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full font-medium">
            {translate('pending')}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// Trip card component
function TripCard({ trip, isActive, onSelect }) {
  const { translate } = useLanguage()
  const { darkMode } = useTheme()
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      case 'in-progress': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
      case 'pending': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }
  
  return (
    <motion.div 
      className={`p-5 rounded-xl mb-4 cursor-pointer ${isActive 
        ? 'bg-gradient-to-r from-cyan-50/80 to-blue-50/80 dark:from-cyan-900/30 dark:to-blue-900/30 border-2 border-cyan-500' 
        : 'bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 shadow-sm'}`}
      onClick={() => onSelect(trip.id)}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{translate('route')} {trip.route}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(trip.status)}`}>
              {translate(trip.status)}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{translate('trip_id')}: {trip.id}</p>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">{trip.startTime}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">{trip.endTime}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium">{trip.passengers}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{translate('passengers')}</p>
        </div>
      </div>
      
      {/* Progress indicator for in-progress trips */}
      {trip.status === 'in-progress' && (
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{translate('progress')}</span>
            <span>
              {trip.checkpoints.filter(cp => cp.status === 'completed').length} / {trip.checkpoints.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(trip.checkpoints.filter(cp => cp.status === 'completed').length / trip.checkpoints.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Main DriverDashboard component
export default function DriverDashboard() {
  const { translate } = useLanguage()
  const { darkMode } = useTheme()
  const [location, setLocation] = useState(null)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)
  const [trips, setTrips] = useState(sampleTrips)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [scanResults, setScanResults] = useState([])
  const [scrollY, setScrollY] = useState(0)
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Handle location updates
  const handleLocationUpdate = (newLocation) => {
    setLocation(newLocation)
  }
  
  // Toggle location tracking
  const toggleLocation = () => {
    if (!location) {
      // If location is not available, request it first
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLocationEnabled(true) // Enable location tracking after getting position
        },
        error => {
          console.error('Error getting location:', error)
        }
      )
    } else {
      // If location is available, just toggle the tracking state
      setLocationEnabled(!locationEnabled)
    }
  }
  
  // Toggle QR scanner
  const toggleScanner = () => {
    setScannerActive(!scannerActive)
  }
  
  // Handle QR scan
  const handleScan = (result) => {
    setScanResults([result, ...scanResults])
    setScannerActive(false)
  }
  
  // Handle trip selection
  const handleTripSelect = (tripId) => {
    setSelectedTrip(tripId === selectedTrip ? null : tripId)
  }
  
  // Mark checkpoint as complete
  const markCheckpointComplete = (checkpointName) => {
    setTrips(trips.map(trip => {
      if (trip.id === selectedTrip) {
        const updatedCheckpoints = trip.checkpoints.map(cp => {
          if (cp.name === checkpointName) {
            return { ...cp, status: 'completed' }
          }
          return cp
        })
        
        // Find next checkpoint and mark it as in-progress
        const completedIndex = updatedCheckpoints.findIndex(cp => cp.name === checkpointName)
        if (completedIndex < updatedCheckpoints.length - 1) {
          updatedCheckpoints[completedIndex + 1].status = 'in-progress'
        }
        
        // Check if all checkpoints are completed
        const allCompleted = updatedCheckpoints.every(cp => cp.status === 'completed')
        
        return { 
          ...trip, 
          checkpoints: updatedCheckpoints,
          status: allCompleted ? 'completed' : 'in-progress'
        }
      }
      return trip
    }))
  }
  
  // Get the selected trip object
  const getSelectedTripDetails = () => {
    return trips.find(trip => trip.id === selectedTrip) || null
  }
  
  const selectedTripDetails = getSelectedTripDetails()
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Modern Hero Section with Gradient Background */}
      <section className="relative section-spacing">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent dark:from-gray-900/80 backdrop-blur-sm"></div>
        </div>
        
        <motion.div 
          className="container-modern relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className={darkMode ? 'text-white' : 'text-gray-800'}>{translate('driver_dashboard')}</span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {translate('control_center')}
              </span>
            </h1>
          </div>
          
          {/* Location permission handler */}
          <LocationPermissionHandler onLocationUpdate={handleLocationUpdate} />
        </motion.div>
      </section>
      
      {/* Control panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-12">
        <motion.div 
          className="card-modern glass dark:glass-dark p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {translate('location_tracking')}
          </h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${locationEnabled ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {locationEnabled ? translate('location_active') : translate('location_inactive')}
                </p>
              </div>
              {location && (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              )}
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={locationEnabled}
                onChange={toggleLocation}
                disabled={!location}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>
          
          {/* Live location map */}
          <div className="mt-6 rounded-xl overflow-hidden shadow-inner">
            <LiveLocationMap location={location} locationEnabled={locationEnabled} />
          </div>
        </motion.div>
        
        <motion.div 
          className="card-modern glass dark:glass-dark p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
          
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            {translate('ticket_scanner')}
          </h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 relative z-10 mb-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${scannerActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {scannerActive ? translate('scanner_active') : translate('scanner_inactive')}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {translate('scanned_tickets')}:
                </span>
                <span className="ml-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {scanResults.length}
                </span>
              </div>
            </div>
            
            <button 
              onClick={toggleScanner}
              className={`px-6 py-3 bg-gradient-to-r ${scannerActive ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} rounded-full text-white text-sm font-medium shadow-lg transition-all hover:shadow-xl hover:scale-105`}
            >
              {scannerActive ? translate('stop_scanning') : translate('start_scanning')}
            </button>
          </div>
          
          {/* QR Scanner */}
          <QRScanner isActive={scannerActive} onScan={handleScan} />
          
          {/* Recent scans */}
              {scanResults.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {translate('recent_scans')}
                  </h3>
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {scanResults.map((result, index) => (
                      <motion.div 
                        key={index} 
                        className={`p-4 rounded-xl shadow-sm border transition-all duration-300 ${result.valid ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800/30 hover:shadow-md hover:border-green-200 dark:hover:border-green-700/50' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100 dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-800/30 hover:shadow-md hover:border-red-200 dark:hover:border-red-700/50'}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${result.valid ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                              <p className="font-medium">{result.ticketId}</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              {result.route}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${result.valid ? 'bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-100'}`}>
                            {result.valid ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {translate('valid')}
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {translate('invalid')}
                              </>
                            )}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
        </motion.div>
      </div>
      
      {/* Trip management */}
      <motion.div 
        className="card-modern glass dark:glass-dark p-8 mb-12 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white relative z-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {translate('trip_management')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Trip list */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {translate('todays_trips')}
            </h3>
            
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <TripCard 
                  trip={trip} 
                  isActive={trip.id === selectedTrip}
                  onSelect={handleTripSelect}
                />
              </motion.div>
            ))}
          </div>
          
          {/* Trip details */}
          <div className="md:col-span-2">
            {selectedTripDetails ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translate('trip_details')}: {selectedTripDetails.route} ({selectedTripDetails.id})
                </h3>
                
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{translate('start_time')}:</span> 
                          <span className="ml-2 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full text-green-700 dark:text-green-300 text-sm">
                            {selectedTripDetails.startTime}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{translate('end_time')}:</span> 
                          <span className="ml-2 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full text-red-700 dark:text-red-300 text-sm">
                            {selectedTripDetails.endTime}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{translate('status')}:</span> 
                          <span className="ml-2 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full text-blue-700 dark:text-blue-300 text-sm">
                            {translate(selectedTripDetails.status)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{translate('passengers')}:</span> 
                          <span className="ml-2 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full text-purple-700 dark:text-purple-300 text-sm">
                            {selectedTripDetails.passengers}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {translate('checkpoints')}
                </h4>
                
                <div className="space-y-3">
                  {selectedTripDetails.checkpoints.map((checkpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <CheckpointCard 
                        checkpoint={checkpoint} 
                        isActive={checkpoint.status === 'in-progress'}
                        onMarkComplete={markCheckpointComplete}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 flex items-center text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {translate('select_trip')}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}