import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function LanguageSelector() {
  const [lang, setLang] = useState('en')
  const [isOpen, setIsOpen] = useState(false)
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ]
  
  const currentLang = languages.find(l => l.code === lang)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
        aria-label="Language selector"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLang(language.code)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  
  useEffect(() => {
    setOpen(false)
  }, [location])

  const linkClass = ({ isActive }) => {
    const baseClass = "nav-link relative px-6 py-3 font-semibold text-sm transition-all duration-300"
    const activeClass = "text-emerald-600 border-b-2 border-emerald-500"
    const inactiveClass = "text-gray-700 hover:text-emerald-600"
    
    // Special highlight for Live Tracking as hero feature
    if (isActive && location.pathname === '/live') {
      return `${baseClass} text-emerald-600 border-b-2 border-emerald-500 font-bold`
    }
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`
  }

  const mobileClass = ({ isActive }) =>
    `block px-6 py-4 text-base font-medium transition-all duration-300 rounded-2xl mx-2 my-1 ${isActive 
      ? 'text-emerald-600 border-l-4 border-emerald-500 pl-5' 
      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'}`

  return (
    <>
      {/* Glassmorphic Navbar */}
      <header className="fixed top-0 w-full z-50 glass border-b border-white/20 shadow-glass">
        <div className="container-modern">
          <div className="h-20 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden p-3 rounded-full hover:bg-white/20 transition-all duration-300"
                aria-label="Open menu"
                onClick={() => setOpen(!open)}
              >
                {/* Animated Hamburger */}
                <div className="w-6 h-6 relative">
                  <span className={`absolute block w-full h-0.5 bg-gray-700 transform transition-all duration-300 ${open ? 'rotate-45 top-3' : 'top-1'}`}></span>
                  <span className={`absolute block w-full h-0.5 bg-gray-700 transform transition-all duration-300 top-3 ${open ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`absolute block w-full h-0.5 bg-gray-700 transform transition-all duration-300 ${open ? '-rotate-45 top-3' : 'top-5'}`}></span>
                </div>
              </button>
              
              <Link to="/" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-gradient">TransitTrack</h1>
                  <p className="text-xs text-gray-600 font-medium">Smarter Commutes, Greener Cities</p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <NavLink to="/" end className={linkClass}>🏠 Home</NavLink>
              <NavLink to="/live" className={linkClass}>
                <span className="flex items-center gap-2">
                  🎯 Live Tracking
                </span>
              </NavLink>
              <NavLink to="/routes" className={linkClass}>🗺️ Routes</NavLink>
              <NavLink to="/green" className={linkClass}>
                <span className="flex items-center gap-2">
                  🌱 Sustainability
                </span>
              </NavLink>
              <NavLink to="/profile" className={linkClass}>👤 Profile</NavLink>
              <NavLink to="/feedback" className={linkClass}>💬 Feedback</NavLink>
              <NavLink to="/accessibility" className={linkClass}>♿ Settings</NavLink>
            </nav>
            
            {/* Right Section */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSelector />
              <NavLink 
                to="/login" 
                className="btn-primary text-sm hidden sm:inline-flex items-center gap-2"
              >
                👤 Login
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Slide-out Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        ></div>
        
        {/* Slide Menu */}
        <div className={`absolute left-0 top-0 h-full w-80 max-w-[80vw] glass-dark transform transition-all duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 space-y-4">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 pb-6 border-b border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">TransitTrack</h2>
                <p className="text-xs text-gray-300">Smarter Commutes</p>
              </div>
            </div>
            
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              <NavLink to="/" end className={mobileClass}>🏠 Home</NavLink>
              <NavLink to="/live" className={mobileClass}>🎯 Live Tracking</NavLink>
              <NavLink to="/routes" className={mobileClass}>🗺️ Routes</NavLink>
              <NavLink to="/green" className={mobileClass}>🌱 Sustainability</NavLink>
              <NavLink to="/profile" className={mobileClass}>👤 Profile</NavLink>
              <NavLink to="/feedback" className={mobileClass}>💬 Feedback</NavLink>
              <NavLink to="/accessibility" className={mobileClass}>♿ Settings</NavLink>
            </nav>
            
            {/* Mobile Theme Toggle and Login */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Theme Mode</span>
                <ThemeToggle />
              </div>
              <NavLink to="/login" className="btn-primary w-full justify-center text-sm">👤 Login</NavLink>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
    </>
  )
}