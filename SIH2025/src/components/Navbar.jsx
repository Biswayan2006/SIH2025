import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

// ✅ Language Selector
function LanguageSelector() {
  const { language, setLanguage, translations } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' }
  ]

  const currentLang = languages.find(l => l.code === language)

  const handleSelect = (code) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-white hover:text-cyan-500 transition"
      >
        <span>{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1a1a2e] border border-cyan-400 rounded-xl shadow-lg z-50 overflow-hidden">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => handleSelect(language.code)}
              className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-800 dark:text-white hover:text-cyan-500 transition"
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

// ✅ Nav items
const getNavItems = (translate, user) => {
  const baseItems = [
    { to: '/', label: translate('home') },
    { to: '/live', label: translate('liveTracking') },
    { to: '/routes', label: translate('routes') },
    { to: '/green', label: translate('sustainability') },
    { to: '/profile', label: translate('profile') },
    { to: '/feedback', label: translate('feedback') },
    { to: '/accessibility', label: translate('settings') }
  ]
  
  // Add role-specific items
  if (user && user.role === 'driver') {
    baseItems.push({ to: '/driver', label: translate('driverDashboard') || 'Driver Dashboard' })
  } else if (user && user.role === 'admin') {
    baseItems.push({ to: '/admin', label: translate('adminDashboard') || 'Admin Dashboard' })
  }
  
  return baseItems
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { translate } = useLanguage()
  const { user } = useAuth()
  const navItems = getNavItems(translate, user)

  useEffect(() => {
    setOpen(false)
  }, [location])

  const linkClass = ({ isActive }) =>
    `relative font-medium px-3 py-1 text-gray-800 dark:text-white transition
     after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 
     after:bg-cyan-500 after:transition-all after:duration-300
     hover:after:w-full hover:text-cyan-500
     ${isActive ? 'text-cyan-500 after:w-full' : ''}`

  const mobileClass = ({ isActive }) =>
    `block text-lg py-2 text-center transition-colors
     ${isActive ? 'text-cyan-500' : 'text-gray-800 dark:text-white hover:text-cyan-500'}`

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full bg-[#F8F9FA]/70 dark:bg-[#1a1a2e]/90 backdrop-blur-md shadow-lg flex justify-between items-center px-4 py-2 z-50 transition">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/src/assets/image.png"
            alt="logo"
            className="h-12 w-12 rounded-full border-2 border-cyan-500 shadow-md"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4 lg:gap-8 items-center">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSelector />
          <ThemeToggle />
          <NavLink to="/login" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 text-sm rounded-lg font-medium shadow-md hover:shadow-cyan-400/40 transition">
            {translate('login')}
          </NavLink>
        </div>

        {/* Hamburger */}
        <div
          className={`md:hidden flex flex-col justify-between w-8 h-6 cursor-pointer ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span className={`h-1 w-full bg-gray-800 dark:bg-white rounded transition ${open ? 'rotate-45 translate-y-2 bg-cyan-500' : ''}`} />
          <span className={`h-1 w-full bg-gray-800 dark:bg-white rounded transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-1 w-full bg-gray-800 dark:bg-white rounded transition ${open ? '-rotate-45 -translate-y-2 bg-cyan-500' : ''}`} />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#1a1a2e] backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center gap-6 mt-24">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/login" className="bg-[#1B9AAA] hover:bg-cyan-600 text-white px-4 py-1.5 text-sm rounded-lg font-medium shadow-md hover:shadow-cyan-400/40 transition">
            👤 {translate('login')}
          </NavLink>
        </div>
      </div>
    </>
  )
}
