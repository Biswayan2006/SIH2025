import { useState, useEffect } from 'react'

export default function GreenScore() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [userLevel, setUserLevel] = useState(3)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [animateCounters, setAnimateCounters] = useState(false)
  
  const userStats = {
    month: {
      co2Saved: 42.5,
      trips: 22,
      distance: 180.5,
      moneySaved: 450,
      treesEquivalent: 1.8
    },
    year: {
      co2Saved: 485.2,
      trips: 278,
      distance: 2146.3,
      moneySaved: 5400,
      treesEquivalent: 20.4
    },
    allTime: {
      co2Saved: 1256.8,
      trips: 742,
      distance: 5832.1,
      moneySaved: 14200,
      treesEquivalent: 52.9
    }
  }
  
  const achievements = [
    { id: 1, name: 'First Ride', description: 'Complete your first bus journey', icon: '🎆', unlocked: true, date: '2024-01-15' },
    { id: 2, name: 'Eco Warrior', description: 'Save 50kg CO₂ in a month', icon: '🌱', unlocked: true, date: '2024-02-20' },
    { id: 3, name: 'Regular Commuter', description: 'Take 20 bus trips in a month', icon: '🚌', unlocked: true, date: '2024-02-28' },
    { id: 4, name: 'Green Champion', description: 'Save 100kg CO₂ in a month', icon: '🏆', unlocked: false, progress: 85 },
    { id: 5, name: 'Climate Hero', description: 'Save 500kg CO₂ total', icon: '🦸', unlocked: true, date: '2024-08-10' },
    { id: 6, name: 'Transit Master', description: 'Use 5 different routes', icon: '🗺️', unlocked: false, progress: 60 },
    { id: 7, name: 'Streak Master', description: 'Use public transit 30 days in a row', icon: '🔥', unlocked: false, progress: 23 },
    { id: 8, name: 'Forest Protector', description: 'Save equivalent of 25 trees', icon: '🌳', unlocked: false, progress: 40 }
  ]
  
  const leaderboard = [
    { rank: 1, name: 'EcoExplorer', co2Saved: 156.8, trips: 89, level: 8 },
    { rank: 2, name: 'GreenCommuter', co2Saved: 134.2, trips: 76, level: 7 },
    { rank: 3, name: 'You', co2Saved: 42.5, trips: 22, level: 3 },
    { rank: 4, name: 'ClimateWarrior', co2Saved: 38.9, trips: 19, level: 3 },
    { rank: 5, name: 'TreeHugger', co2Saved: 35.1, trips: 18, level: 2 }
  ]
  
  const levels = [
    { level: 1, name: 'Eco Newbie', minCO2: 0, color: 'from-gray-400 to-gray-500' },
    { level: 2, name: 'Green Starter', minCO2: 20, color: 'from-green-400 to-green-500' },
    { level: 3, name: 'Eco Commuter', minCO2: 50, color: 'from-blue-400 to-blue-500' },
    { level: 4, name: 'Green Champion', minCO2: 100, color: 'from-purple-400 to-purple-500' },
    { level: 5, name: 'Climate Warrior', minCO2: 200, color: 'from-yellow-400 to-orange-500' },
    { level: 6, name: 'Eco Master', minCO2: 350, color: 'from-red-400 to-pink-500' },
    { level: 7, name: 'Green Legend', minCO2: 500, color: 'from-indigo-400 to-purple-600' },
    { level: 8, name: 'Planet Saver', minCO2: 750, color: 'from-emerald-400 to-teal-500' }
  ]
  
  const currentLevel = levels[userLevel - 1]
  const nextLevel = levels[userLevel]
  const progressToNext = nextLevel ? 
    ((userStats[selectedPeriod].co2Saved - currentLevel.minCO2) / (nextLevel.minCO2 - currentLevel.minCO2)) * 100 : 100
  
  useEffect(() => {
    setAnimateCounters(true)
    const timer = setTimeout(() => setAnimateCounters(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedPeriod])
  
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }
  
  const AnimatedCounter = ({ value, suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0)
    
    useEffect(() => {
      if (animateCounters) {
        let start = 0
        const end = parseFloat(value)
        const duration = 1500
        const increment = end / (duration / 16)
        
        const counter = setInterval(() => {
          start += increment
          if (start >= end) {
            setDisplayValue(end)
            clearInterval(counter)
          } else {
            setDisplayValue(start)
          }
        }, 16)
        
        return () => clearInterval(counter)
      } else {
        setDisplayValue(parseFloat(value))
      }
    }, [value, animateCounters])
    
    return (
      <span>
        {displayValue % 1 === 0 ? Math.floor(displayValue) : displayValue.toFixed(1)}
        {suffix}
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="container-modern section-spacing">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-hero mb-6">
            Your Green
            <br />
            <span className="text-gradient">Impact</span>
          </h1>
          <p className="text-body max-w-2xl mx-auto">
            Track your environmental impact, compete with the community, and make every journey count
          </p>
        </div>

        {/* Level Badge Card */}
        <div className="card-modern p-8 mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6">
            <div className={`inline-flex px-8 py-4 bg-gradient-to-r ${currentLevel.color} text-white rounded-2xl shadow-modern`}>
              <div className="text-center">
                <div className="text-3xl font-bold">Level {userLevel}</div>
                <div className="text-sm opacity-90">{currentLevel.name}</div>
              </div>
            </div>
            
            {/* Progress to Next Level */}
            {nextLevel && (
              <div className="flex-1 max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress to {nextLevel.name}</span>
                  <span className="font-medium text-emerald-600">{Math.round(progressToNext)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(progressToNext, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.max(0, nextLevel.minCO2 - userStats[selectedPeriod].co2Saved).toFixed(1)} kg CO₂ to go
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Period Selector */}
        <div className="card-modern p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { value: 'month', label: 'This Month', icon: '📅' },
              { value: 'year', label: 'This Year', icon: '🗓️' },
              { value: 'allTime', label: 'All Time', icon: '⭐' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedPeriod === period.value
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <span>{period.icon}</span>
                {period.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Stats - Animated Counters */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🌍
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">CO₂ Saved</div>
                <div className="text-3xl font-bold text-emerald-600">
                  <AnimatedCounter value={userStats[selectedPeriod].co2Saved} suffix=" kg" />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Equivalent to <span className="font-semibold text-emerald-600">
                <AnimatedCounter value={userStats[selectedPeriod].treesEquivalent} /> trees
              </span> planted
            </div>
          </div>
          
          <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🚌
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Trips Taken</div>
                <div className="text-3xl font-bold text-blue-600">
                  <AnimatedCounter value={userStats[selectedPeriod].trips} />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">
                {formatNumber(userStats[selectedPeriod].distance)}
              </span> km traveled
            </div>
          </div>
          
          <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                💰
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Money Saved</div>
                <div className="text-3xl font-bold text-purple-600">
                  ₹<AnimatedCounter value={userStats[selectedPeriod].moneySaved} />
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Compared to using private transport
            </div>
          </div>
          
          <div className="card-modern p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🏆
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Community Rank</div>
                <div className="text-3xl font-bold text-orange-600">
                  #{leaderboard.find(user => user.name === 'You')?.rank || '-'}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex justify-end">
              <button 
                onClick={() => setShowLeaderboard(true)}
                className="text-orange-600 font-medium hover:underline"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>
        
        {/* Achievements Section */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <div className="card-modern p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🏅 Your Achievements
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-2 ${
                      achievement.unlocked ? 'grayscale-0' : 'grayscale'
                    }`}>
                      {achievement.icon}
                    </div>
                    <h3 className={`font-semibold mb-1 ${
                      achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                    
                    {achievement.unlocked ? (
                      <div className="text-xs text-green-600 font-medium">
                        Unlocked {achievement.date}
                      </div>
                    ) : achievement.progress ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          {achievement.progress}% complete
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">
                        Not unlocked
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    🏆 Community Leaderboard
                  </h2>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        user.name === 'You' 
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        user.rank === 1 ? 'bg-yellow-500' :
                        user.rank === 2 ? 'bg-gray-400' :
                        user.rank === 3 ? 'bg-orange-500' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {user.rank}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          user.name === 'You' ? 'text-blue-600' : 'text-gray-800'
                        }`}>
                          {user.name}
                          {user.name === 'You' && ' (You)'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Level {user.level} • {user.trips} trips
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-green-600">{user.co2Saved}kg</div>
                        <div className="text-sm text-gray-500">CO₂ saved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Environmental Impact Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* CO2 Savings Chart */}
          <div className="card-modern p-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              📈 CO₂ Savings Trend
            </h3>
            <div className="space-y-4">
              {/* Simple bar chart placeholder with Tailwind */}
              <div className="grid grid-cols-7 gap-2 h-32">
                {[65, 78, 45, 89, 92, 67, 85].map((height, index) => (
                  <div key={index} className="flex flex-col justify-end">
                    <div 
                      className="bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-lg transition-all duration-1000 hover:from-emerald-600 hover:to-green-500"
                      style={{ height: `${height}%`, animationDelay: `${index * 0.1}s` }}
                    ></div>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 text-center">
                Weekly CO₂ savings (kg)
              </div>
            </div>
          </div>
        
          {/* Impact Breakdown Chart */}
          <div className="card-modern p-6 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              🍰 Impact Breakdown
            </h3>
            <div className="space-y-4">
              {/* Simple pie chart representation with Tailwind */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full relative overflow-hidden" 
                     style={{ background: `conic-gradient(#10b981 0% 40%, #3b82f6 40% 70%, #8b5cf6 70% 85%, #f59e0b 85% 100%)` }}>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">100%</div>
                      <div className="text-xs text-gray-500">Green</div>
                    </div>
                  </div>
                </div>
              </div>
                      
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Bus Transport (40%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Metro Usage (30%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Shared Rides (15%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Walking (15%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Motivational Banner */}
        <div className="card-modern p-8 mb-8 text-center bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-6xl animate-pulse-modern">
              🌳
            </div>
            <div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-2">
                Amazing! You've saved enough carbon to equal planting {Math.floor(userStats[selectedPeriod].treesEquivalent)} trees!
              </h3>
              <p className="text-emerald-600">
                Your eco-friendly choices are making a real difference for our planet. Keep up the fantastic work!
              </p>
            </div>
            <div className="text-4xl">
              🌍
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}