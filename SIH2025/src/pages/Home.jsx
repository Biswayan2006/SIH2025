import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Real-Time Tracking',
    description: 'Track buses live with precise location data and accurate arrival predictions',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🤖',
    title: 'AI Crowd Prediction',
    description: 'Smart algorithms predict crowd density to help you plan comfortable journeys',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🌱',
    title: 'Carbon Savings Tracker',
    description: 'Monitor your environmental impact and see how much CO₂ you save with every trip',
    gradient: 'from-emerald-500 to-green-500'
  }
]

const stats = [
  { number: '50K+', label: 'Daily Commuters', icon: '👥' },
  { number: '250+', label: 'Active Routes', icon: '🗺️' },
  { number: '98%', label: 'Accuracy Rate', icon: '🎯' },
  { number: '15K', label: 'CO₂ Tons Saved', icon: '🌍' }
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentStat, setCurrentStat] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(statInterval)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setTimeout(() => {
      setIsSearching(false)
      window.location.href = `/live?search=${encodeURIComponent(searchQuery)}`
    }, 1000)
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Modern Hero Section */}
      <section className="relative section-spacing">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/cityscape.svg')] bg-center bg-no-repeat bg-contain opacity-5"></div>
        </div>
        
        <div 
          className="container-modern relative z-10"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="text-center space-y-12">
            {/* Hero Text */}
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Smarter Commutes,
                <br />
                <span className="text-gradient">Greener Cities</span>
              </h1>
              <p className="text-body max-w-3xl mx-auto text-gray-600">
                Experience the future of public transportation with AI-powered tracking, 
                real-time crowd predictions, and environmental impact monitoring.
              </p>
            </div>

            {/* Animated Stats Counter */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="glass rounded-3xl p-8 max-w-md mx-auto shadow-modern">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl animate-pulse-modern">
                    {stats[currentStat].icon}
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-gray-800">
                      {stats[currentStat].number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stats[currentStat].label}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <Link to="/live" className="btn-primary text-lg">
                🚌 Track Buses Now
              </Link>
              <Link to="/routes" className="btn-secondary text-lg">
                🗺️ View Routes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="section-spacing bg-soft">
        <div className="container-modern">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TransitTrack?</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Our platform combines cutting-edge technology with user-friendly design to transform your commuting experience.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card-modern p-8 flex flex-col items-center text-center transform transition-all duration-500 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Search Section */}
      <section className="section-spacing">
        <div className="container-modern">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Search Card */}
            <div className="card-modern p-8 animate-fade-in-up">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    🔍 Find Your Bus
                  </h2>
                  <p className="text-gray-600">
                    Enter your route or destination to get instant tracking
                  </p>
                </div>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Route number, bus stop, or destination..."
                      className="input-modern text-lg"
                    />
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="btn-primary w-full text-lg"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </>
                    ) : (
                      '🚀 Search Now'
                    )}
                  </button>
                </form>

                {/* Quick Access */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 font-medium">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Route 12A', 'Airport Express', 'Central Station', 'University'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="card-modern p-8 animate-slide-in-right">
              <div className="space-y-6">
                <div>
                  <h2 className="text-section-title">
                    📡 Live Transit Map
                  </h2>
                  <p className="text-body">
                    Real-time visualization of active buses in your area
                  </p>
                </div>

                <div className="relative bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl h-80 overflow-hidden">
                  {/* Animated Map Background */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse-modern"></div>
                    <div className="absolute top-12 right-8 w-2 h-2 bg-blue-500 rounded-full animate-pulse-modern" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-8 left-12 w-2 h-2 bg-purple-500 rounded-full animate-pulse-modern" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse-modern" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass rounded-2xl p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Active now:</span>
                        <span className="text-emerald-600 font-bold">12 buses nearby</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  to="/live" 
                  className="btn-secondary w-full justify-center"
                >
                  🗺️ Open Full Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="section-spacing">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-section-title">
              Why Choose TransitTrack?
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Advanced features designed for modern commuters and sustainable transportation
            </p>
          </div>

          <div className="grid-responsive">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="card-modern p-8 text-center group hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-card-title">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-to-br from-emerald-600 to-blue-600 text-white rounded-3xl mx-4 md:mx-8 lg:mx-12 shadow-modern-lg">
        <div className="container-modern text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold animate-fade-in-up">
              Ready to Transform Your Commute?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join thousands of smart commuters making a positive impact on the environment
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link 
                to="/live" 
                className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 glass"
              >
                🚀 Start Tracking Now
              </Link>
              <Link 
                to="/green" 
                className="px-10 py-5 border-2 border-white bg-transparent text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 backdrop-blur-sm"
              >
                🌱 See Environmental Impact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}