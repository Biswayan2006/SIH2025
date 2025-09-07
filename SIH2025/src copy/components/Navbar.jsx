import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useLanguage } from '../context/LanguageContext'

// ✅ Language Selector
function LanguageSelector() {
  const { language, setLanguage, translations } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-white hover:text-cyan-500 transition"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Select language: currently ${currentLang?.name}`}
      >
        <span aria-hidden="true">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1a1a2e] border border-cyan-400 rounded-xl shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
        >
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="w-full px-4 py-2 text-left flex items-center gap-3 text-gray-800 dark:text-white hover:text-cyan-500 transition"
              role="menuitem"
              tabIndex={0}
              aria-current={lang.code === language ? 'true' : 'false'}
            >
              <span aria-hidden="true">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ✅ Nav items
const getNavItems = (translate) => [
  { to: '/', label: translate('home') },
  { to: '/live', label: translate('liveTracking') },
  { to: '/routes', label: translate('routes') },
  { to: '/green', label: translate('sustainability') },
  { to: '/profile', label: translate('profile') },
  { to: '/feedback', label: translate('feedback') },
  { to: '/accessibility', label: translate('settings') }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { translate } = useLanguage()
  const navItems = getNavItems(translate)
  const menuRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [location])
  
  // Handle keyboard navigation for the mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    
    // Focus trap inside modal when open
    const handleTabKey = (e) => {
      if (open && e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        if (focusableElements?.length) {
          const firstElement = focusableElements[0]
          const lastElement = focusableElements[focusableElements.length - 1]
          
          if (e.shiftKey && document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }
    
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleTabKey)
      
      // Focus the first focusable element when menu opens
      setTimeout(() => {
        const closeButton = menuRef.current?.querySelector('button[aria-label="Close mobile menu"]')
        if (closeButton) closeButton.focus()
      }, 100)
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [open])

  const linkClass = ({ isActive }) =>
    `relative font-medium px-3 py-1 transition outline-none
     ${isActive ? 'text-cyan-500' : 'text-gray-800 dark:text-white hover:text-cyan-500'}
     focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a2e] rounded-md`

  const mobileClass = ({ isActive }) =>
    `block text-lg py-2 text-center transition-colors outline-none
     ${isActive ? 'text-cyan-500' : 'text-gray-800 dark:text-white hover:text-cyan-500'}
     focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a2e] rounded-md`

  return (
    <>
      {/* Skip to content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-md"
      >
        Skip to content
      </a>
      
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full bg-[#F8F9FA]/70 dark:bg-[#1a1a2e]/90 backdrop-blur-md shadow-lg flex justify-between items-center px-4 py-2 z-50 transition">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="TransitTrack Home">
          <img
            src="src/assets/image.png"
            alt="logo"
            className="h-12 w-12 rounded-full border-2 border-cyan-500 shadow-md"
          />
          <span className="hidden sm:block font-bold text-xl text-gray-900 dark:text-white">TransitTrack</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 lg:gap-12 items-center" role="navigation" aria-label="Main navigation">
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
          <NavLink to="/login" className="hidden sm:inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 text-sm rounded-lg font-medium shadow-md hover:shadow-cyan-400/40 transition outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a2e]">
            {translate('login')}
          </NavLink>
        </div>

        {/* Hamburger Icon */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between" aria-hidden="true">
            <span className={`absolute h-0.5 w-full bg-gray-800 dark:bg-white rounded-full transition-all duration-300 ${open ? 'rotate-45 top-2 bg-cyan-500' : 'top-0'}`} />
            <span className={`absolute h-0.5 w-full bg-gray-800 dark:bg-white rounded-full transition-all duration-300 ${open ? 'opacity-0' : 'top-2'}`} />
            <span className={`absolute h-0.5 w-full bg-gray-800 dark:bg-white rounded-full transition-all duration-300 ${open ? '-rotate-45 top-2 bg-cyan-500' : 'top-4'}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#1a1a2e] backdrop-blur-xl shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col mt-20 px-4">
          {/* Close button */}
          <button 
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close mobile menu"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* User section */}
          <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mb-2">
              <span className="text-3xl">👤</span>
            </div>
            <NavLink to="/login" className="mt-2 bg-[#1B9AAA] hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-cyan-400/40 transition outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a2e]">
              {translate('login')}
            </NavLink>
          </div>
          
          {/* Navigation items */}
          <div className="flex flex-col space-y-1" role="navigation" aria-label="Mobile navigation">
            {navItems.map(item => {
              // Define icons for each navigation item
              const getIcon = (path) => {
                switch(path) {
                  case '/': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  );
                  case '/live': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  );
                  case '/routes': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  );
                  case '/green': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  );
                  case '/profile': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  );
                  case '/feedback': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  );
                  case '/accessibility': return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  );
                  default: return null;
                }
              };
              
              return (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  end={item.to === '/'} 
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' : 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30'}`
                  }
                >
                  {getIcon(item.to)}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
          
          {/* Bottom section */}
          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col items-center space-y-4" aria-label="Language and theme settings">
            <div className="flex items-center justify-center space-x-4">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
