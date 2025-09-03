import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import PageFadeIn from '../components/PageFadeIn';
import { motion, AnimatePresence } from 'framer-motion';

// Toggle Switch Component with improved label integration
const ToggleSwitch = ({ checked, onChange, disabled = false, label, description }) => {
  const bgColor = checked 
    ? 'bg-blue-600' 
    : 'bg-gray-300 dark:bg-gray-600'
  
  return (
    <div 
      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700" 
      onClick={() => !disabled && onChange(!checked)}
    >
      <div className="flex flex-col">
        {label && <span className="text-gray-800 dark:text-gray-200 font-medium">{label}</span>}
        {description && <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</span>}
      </div>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${bgColor} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          !disabled && onChange(!checked);
        }}
      >
        <span className="sr-only">{checked ? 'Enabled' : 'Disabled'}</span>
        <span
          className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out`}
        />
      </button>
    </div>
  )
}

// Collapsible Section Component with Framer Motion
const CollapsibleSection = ({ title, children, defaultOpen = true, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="mb-8 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <motion.span 
          className="text-xl" 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accessibility() {
  // Predefined accessibility profiles
  const accessibilityProfiles = {
    default: {
      largeText: false,
      highContrast: false,
      voiceAnnouncements: false,
      reduceMotion: false,
      screenReader: false,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'medium',
      theme: 'light'
    },
    elderly: {
      largeText: true,
      highContrast: true,
      voiceAnnouncements: true,
      reduceMotion: true,
      screenReader: false,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'large',
      theme: 'light'
    },
    lowVision: {
      largeText: true,
      highContrast: true,
      voiceAnnouncements: true,
      reduceMotion: false,
      screenReader: true,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'extra-large',
      theme: 'light'
    },
    colorBlind: {
      largeText: false,
      highContrast: false,
      voiceAnnouncements: false,
      reduceMotion: false,
      screenReader: false,
      colorBlindSupport: true,
      language: 'en',
      fontSize: 'medium',
      theme: 'light'
    },
    minimalMotion: {
      largeText: false,
      highContrast: false,
      voiceAnnouncements: false,
      reduceMotion: true,
      screenReader: false,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'medium',
      theme: 'light'
    },
    nightMode: {
      largeText: false,
      highContrast: false,
      voiceAnnouncements: false,
      reduceMotion: false,
      screenReader: false,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'medium',
      theme: 'dark'
    }
  }
  
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    voiceAnnouncements: false,
    reduceMotion: false,
    screenReader: false,
    colorBlindSupport: false,
    language: 'en',
    fontSize: 'medium',
    theme: 'light',
    textToSpeechSpeed: 1.0, // Default speech rate (1.0 = normal speed)
    voicePreset: 'Default', // Default voice preset
    audioCues: false, // Audio cues for notifications
    fontFamily: 'system-ui', // Default font family
    lineSpacing: 'normal', // Default line spacing
    customColors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      background: '#ffffff',
      text: '#111827'
    },
    useCustomColors: false,
    emergencyContacts: [
      { name: '', phone: '', relationship: '' }
    ],
    emergencyMessage: 'I need immediate assistance. This is an emergency.'
  })
  
  // State for emergency modal
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [emergencyModalStep, setEmergencyModalStep] = useState(1)
  
  const [isTestingVoice, setIsTestingVoice] = useState(false)
  const [supportedLanguages] = useState([
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજਰાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' }
  ])
  
  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('accessibilitySettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])
  
  // Add keyboard shortcuts for accessibility features
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + H: Toggle high contrast mode
      if (e.altKey && e.key === 'h') {
        updateSetting('highContrast', !settings.highContrast)
      }
      // Alt + D: Toggle dark/light theme
      else if (e.altKey && e.key === 'd') {
        const themeMap = { light: 'dark', dark: 'light', auto: 'light' }
        updateSetting('theme', themeMap[settings.theme])
      }
      // Alt + M: Toggle reduced motion
      else if (e.altKey && e.key === 'm') {
        updateSetting('reduceMotion', !settings.reduceMotion)
      }
      // Alt + F: Cycle through font sizes
      else if (e.altKey && e.key === 'f') {
        const fontSizes = ['small', 'medium', 'large', 'extra-large']
        const currentIndex = fontSizes.indexOf(settings.fontSize)
        const nextIndex = (currentIndex + 1) % fontSizes.length
        updateSetting('fontSize', fontSizes[nextIndex])
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [settings])
  
  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    
    // Apply settings to document
    applySettings(settings)
    
    // Add listener for system theme changes if auto theme is selected
    if (settings.theme === 'auto') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleThemeChange = (e) => {
        const root = document.documentElement
        e.matches ? root.classList.add('dark') : root.classList.remove('dark')
      }
      
      darkModeMediaQuery.addEventListener('change', handleThemeChange)
      return () => darkModeMediaQuery.removeEventListener('change', handleThemeChange)
    }
  }, [settings])
  
  const applySettings = (newSettings) => {
    const root = document.documentElement
    
    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '22px'
    }
    root.style.fontSize = fontSizes[newSettings.fontSize]
    
    // Apply high contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Apply reduced motion
    if (newSettings.reduceMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
    
    // Apply theme
    root.setAttribute('data-theme', newSettings.theme)
    
    // Add dark class to HTML for better Tailwind dark mode support
    if (newSettings.theme === 'dark') {
      root.classList.add('dark')
    } else if (newSettings.theme === 'auto') {
      // Check system preference for dark mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      prefersDark ? root.classList.add('dark') : root.classList.remove('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Apply custom font family
    root.style.setProperty('--font-family', newSettings.fontFamily)
    document.body.style.fontFamily = `var(--font-family), system-ui, sans-serif`
    
    // Apply line spacing
    root.style.setProperty('--line-spacing', newSettings.lineSpacing)
    document.body.style.lineHeight = `var(--line-spacing)`
    
    // Apply custom colors if enabled
    if (newSettings.useCustomColors) {
      root.style.setProperty('--color-primary', newSettings.customColors.primary)
      root.style.setProperty('--color-secondary', newSettings.customColors.secondary)
      root.style.setProperty('--color-background', newSettings.customColors.background)
      root.style.setProperty('--color-text', newSettings.customColors.text)
      root.classList.add('custom-colors')
    } else {
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-secondary')
      root.style.removeProperty('--color-background')
      root.style.removeProperty('--color-text')
      root.classList.remove('custom-colors')
    }
  }
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }
  
  const testVoiceAnnouncement = () => {
    if (!('speechSynthesis' in window)) {
      alert('Voice announcements are not supported in your browser')
      return
    }
    
    setIsTestingVoice(true)
    const utterance = new SpeechSynthesisUtterance(
      `Bus 12A arriving at Central Station in 3 minutes. Crowd level is low.`
    )
    
    const selectedLang = supportedLanguages.find(lang => lang.code === settings.language)
    utterance.lang = selectedLang ? selectedLang.code : 'en'
    utterance.rate = settings.textToSpeechSpeed // Apply the speech rate setting
    
    // Apply voice preset settings
    switch(settings.voicePreset) {
      case 'Clear':
        utterance.pitch = 1.2
        utterance.volume = 1.0
        break
      case 'Friendly':
        utterance.pitch = 1.1
        utterance.volume = 0.9
        break
      case 'Professional':
        utterance.pitch = 0.9
        utterance.volume = 1.0
        break
      default: // Default preset
        utterance.pitch = 1.0
        utterance.volume = 0.8
    }
    
    utterance.onend = () => setIsTestingVoice(false)
    utterance.onerror = () => setIsTestingVoice(false)
    
    speechSynthesis.speak(utterance)
  }
  
  const resetSettings = () => {
    setSettings(accessibilityProfiles.default)
  }
  
  const applyProfile = (profileName) => {
    if (accessibilityProfiles[profileName]) {
      // Merge the profile with current settings to preserve properties not in the profile
      setSettings(prevSettings => ({
        ...prevSettings,
        ...accessibilityProfiles[profileName]
      }))
    }
  }
  
  // Export settings to JSON file
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    
    const exportFileDefaultName = 'accessibility-settings.json'
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
  
  // Import settings from JSON file
  const importSettings = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result)
        setSettings(importedSettings)
      } catch (error) {
        alert('Invalid settings file. Please upload a valid JSON file.')
      }
    }
    reader.readAsText(file)
    
    // Reset the file input
    event.target.value = null
  }
  
  const containerClass = `min-h-screen transition-all duration-300 ${
    settings.highContrast ? 'bg-black text-white' : 'bg-gray-50'
  }`
  
  const cardClass = `rounded-lg shadow-sm p-6 transition-all duration-300 ${
    settings.highContrast ? 'bg-gray-900 border-2 border-white' : 'bg-white'
  }`
  
  const textClass = settings.highContrast ? 'text-white' : 'text-gray-800'
  const subtextClass = settings.highContrast ? 'text-gray-300' : 'text-gray-600'
  
  return (
    <PageFadeIn>
      <div className={containerClass}>
      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg shadow-lg ${settings.highContrast ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Emergency Settings</h3>
              <button 
                onClick={() => setShowEmergencyModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            {/* Step Indicators */}
             <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
               <button 
                 onClick={() => setEmergencyModalStep(1)}
                 className={`flex-1 pb-2 pt-1 font-medium text-center border-b-2 ${
                   emergencyModalStep === 1 ? 
                   (settings.highContrast ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600') : 
                   'border-transparent text-gray-500'
                 }`}
               >
                 <div className="flex flex-col items-center">
                   <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm mb-1 ${
                     emergencyModalStep === 1 ? 
                     'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 
                     'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                   }`}>1</span>
                   <span>Message</span>
                 </div>
               </button>
               <button 
                 onClick={() => setEmergencyModalStep(2)}
                 className={`flex-1 pb-2 pt-1 font-medium text-center border-b-2 ${
                   emergencyModalStep === 2 ? 
                   (settings.highContrast ? 'border-blue-400 text-blue-300' : 'border-blue-500 text-blue-600') : 
                   'border-transparent text-gray-500'
                 }`}
               >
                 <div className="flex flex-col items-center">
                   <span className={`w-6 h-6 flex items-center justify-center rounded-full text-sm mb-1 ${
                     emergencyModalStep === 2 ? 
                     'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 
                     'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                   }`}>2</span>
                   <span>Contacts</span>
                 </div>
               </button>
             </div>
            
            <div className="space-y-4 mb-6">
               {/* Step 1: Emergency Message */}
               {emergencyModalStep === 1 && (
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div>
                     <label className="block text-sm font-medium mb-2">Emergency Message</label>
                     <textarea
                       value={settings.emergencyMessage}
                       onChange={(e) => updateSetting('emergencyMessage', e.target.value)}
                       className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${settings.highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                       rows="3"
                       placeholder="Enter your emergency message here..."
                     ></textarea>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                       This message will be sent to your emergency contacts when you activate the SOS feature.
                     </p>
                   </div>
                   
                   <div className="mt-6 flex justify-end">
                     <button
                       onClick={() => setEmergencyModalStep(2)}
                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                     >
                       Next: Contacts <span>→</span>
                     </button>
                   </div>
                 </motion.div>
               )}
               
               {/* Step 2: Emergency Contacts */}
               {emergencyModalStep === 2 && (
                 <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.3 }}
                 >
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium">Emergency Contacts</label>
                       <button
                         onClick={() => {
                           const updatedContacts = [...settings.emergencyContacts, { name: '', phone: '', relationship: '' }];
                           updateSetting('emergencyContacts', updatedContacts);
                         }}
                         className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                       >
                         <span>+</span> Add Contact
                       </button>
                     </div>
                     
                     {settings.emergencyContacts.map((contact, index) => (
                       <div key={index} className="p-3 border rounded-lg mb-3 space-y-3 bg-gray-50 dark:bg-gray-800">
                         <div className="flex justify-between items-start">
                           <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded">
                             Contact {index + 1}
                           </span>
                           
                           {settings.emergencyContacts.length > 1 && (
                             <button
                               onClick={() => {
                                 const updatedContacts = settings.emergencyContacts.filter((_, i) => i !== index);
                                 updateSetting('emergencyContacts', updatedContacts);
                               }}
                               className="text-red-500 hover:text-red-700"
                               aria-label="Remove contact"
                             >
                               ✕
                             </button>
                           )}
                         </div>
                         
                         <div>
                           <label className="block text-xs mb-1">Name</label>
                           <input
                             type="text"
                             value={contact.name}
                             onChange={(e) => {
                               const updatedContacts = [...settings.emergencyContacts];
                               updatedContacts[index].name = e.target.value;
                               updateSetting('emergencyContacts', updatedContacts);
                             }}
                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${settings.highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                             placeholder="Contact name"
                           />
                         </div>
                         
                         <div>
                           <label className="block text-xs mb-1">Phone Number</label>
                           <input
                             type="tel"
                             value={contact.phone}
                             onChange={(e) => {
                               const updatedContacts = [...settings.emergencyContacts];
                               updatedContacts[index].phone = e.target.value;
                               updateSetting('emergencyContacts', updatedContacts);
                             }}
                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${settings.highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                             placeholder="Phone number"
                           />
                         </div>
                         
                         <div>
                           <label className="block text-xs mb-1">Relationship</label>
                           <input
                             type="text"
                             value={contact.relationship}
                             onChange={(e) => {
                               const updatedContacts = [...settings.emergencyContacts];
                               updatedContacts[index].relationship = e.target.value;
                               updateSetting('emergencyContacts', updatedContacts);
                             }}
                             className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${settings.highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                             placeholder="Relationship"
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-6 flex justify-between">
                     <button
                       onClick={() => setEmergencyModalStep(1)}
                       className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                     >
                       <span>←</span> Back to Message
                     </button>
                   </div>
                 </motion.div>
               )}
             </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={cardClass + ' mb-6'}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${textClass} flex items-center gap-2`}>
                ♿ Accessibility & Settings
              </h1>
              <p className={subtextClass + ' mt-1'}>
                Customize your experience for better accessibility and language preferences
              </p>
              <div className={`mt-2 text-sm ${subtextClass}`}>
                <span className="font-medium">Keyboard shortcuts: </span>
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700">
                  Alt+H
                </span> High Contrast, 
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700">
                  Alt+D
                </span> Dark/Light, 
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700">
                  Alt+M
                </span> Reduce Motion, 
                <span className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700">
                  Alt+F
                </span> Font Size
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={exportSettings}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span role="img" aria-label="Save" className="text-lg">💾</span> Export Settings
              </motion.button>
              
              <motion.label 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span role="img" aria-label="Import" className="text-lg">📂</span> Import Settings
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={importSettings} 
                  className="hidden" 
                />
              </motion.label>
              
              <motion.button
                onClick={resetSettings}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span role="img" aria-label="Reset" className="text-lg">🔄</span> Reset to Default
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Accessibility Profiles */}
        <CollapsibleSection title="Accessibility Profiles" icon="👤" defaultOpen={true}>
          <p className={`${subtextClass} mb-4`}>
            Apply predefined settings with one click to optimize your experience
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(accessibilityProfiles).map(([key, profile]) => {
              // Define icons for each profile
              const profileIcons = {
                default: '⚙️',
                elderly: '👴',
                lowVision: '👁️',
                colorBlind: '🎨',
                minimalMotion: '✨',
                nightMode: '🌙'
              };
              
              const isActive = JSON.stringify(settings) === JSON.stringify(profile);
              
              return (
                <motion.div
                  key={key}
                  onClick={() => applyProfile(key)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${isActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-700'}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-2xl p-2 rounded-full ${isActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {profileIcons[key]}
                    </div>
                    <div>
                      <div className={`font-medium ${textClass} capitalize text-lg`}>
                        {key === 'default' ? 'Default' : key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className={`text-xs ${subtextClass}`}>
                        {key === 'elderly' && 'Larger text, high contrast, reduced motion'}
                        {key === 'lowVision' && 'Extra large text, high contrast, screen reader'}
                        {key === 'colorBlind' && 'Color blind friendly patterns and indicators'}
                        {key === 'minimalMotion' && 'Reduced animations and transitions'}
                        {key === 'nightMode' && 'Dark theme for reduced eye strain'}
                        {key === 'default' && 'Standard settings'}
                      </div>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1">
                        <span>✓</span> Currently Active
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CollapsibleSection>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Accessibility */}
          <CollapsibleSection title="👁️ Visual Accessibility" icon="👁️" defaultOpen={true}>
            <div className="space-y-4">
              {/* Font Size */}
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="small">Small (14px)</option>
                  <option value="medium">Medium (16px)</option>
                  <option value="large">Large (18px)</option>
                  <option value="extra-large">Extra Large (22px)</option>
                </select>
              </div>
              
              {/* Font Family Selection */}
              <div className="mt-4">
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="system-ui">System Default</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                  <option value="'OpenDyslexic', sans-serif">OpenDyslexic</option>
                  <option value="'Georgia', serif">Georgia</option>
                  <option value="'Verdana', sans-serif">Verdana</option>
                </select>
                <div className={`mt-2 text-xs ${subtextClass}`}>
                  Note: OpenDyslexic font may need to be installed on your system.
                </div>
              </div>
              
              {/* Line Spacing Adjustment */}
              <div className="mt-4">
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Line Spacing
                </label>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${subtextClass}`}>Tight</span>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={settings.lineSpacing === 'normal' ? 1.5 : settings.lineSpacing}
                    onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className={`text-xs ${subtextClass}`}>Spacious</span>
                  <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                    {settings.lineSpacing === 'normal' ? '1.5' : settings.lineSpacing.toFixed(1)}
                  </span>
                </div>
              </div>
              
              {/* High Contrast */}
              <ToggleSwitch
                checked={settings.highContrast}
                onChange={(checked) => updateSetting('highContrast', checked)}
                label="High Contrast Mode"
                description="Increase contrast for better visibility"
              />
              
              {/* Reduce Motion */}
              <ToggleSwitch
                checked={settings.reduceMotion}
                onChange={(checked) => updateSetting('reduceMotion', checked)}
                label="Reduce Motion"
                description="Minimize animations and transitions"
              />
              
              {/* Color Blind Support */}
              <ToggleSwitch
                checked={settings.colorBlindSupport}
                onChange={(checked) => updateSetting('colorBlindSupport', checked)}
                label="Color Blind Support"
                description="Use patterns and symbols alongside colors"
              />
              
              {/* Theme Selection */}
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting('theme', theme)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.theme === theme
                          ? 'bg-blue-600 text-white'
                          : settings.highContrast
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
                
                {/* Custom Color Picker */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <ToggleSwitch
                    checked={settings.useCustomColors}
                    onChange={(checked) => updateSetting('useCustomColors', checked)}
                    label="Use Custom Colors"
                    description="Personalize the app with your own color scheme"
                  />
                  
                  {settings.useCustomColors && (
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 mt-3 rounded-lg ${settings.highContrast ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex flex-col gap-2">
                        <label className={`block text-sm font-medium ${textClass}`}>Primary Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={settings.customColors.primary}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              primary: e.target.value
                            })}
                            className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                            aria-label="Select primary color"
                          />
                          <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                            {settings.customColors.primary.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className={`block text-sm font-medium ${textClass}`}>Secondary Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={settings.customColors.secondary}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              secondary: e.target.value
                            })}
                            className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                            aria-label="Select secondary color"
                          />
                          <div className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded">
                            {settings.customColors.secondary.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${textClass}`}>Background Color:</label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={settings.customColors.background}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              background: e.target.value
                            })}
                            className="w-10 h-10 rounded mr-2 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.customColors.background}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              background: e.target.value
                            })}
                            className={`px-2 py-1 border rounded w-24 ${settings.highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className={`block mb-2 text-sm font-medium ${textClass}`}>Text Color:</label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={settings.customColors.text}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              text: e.target.value
                            })}
                            className="w-10 h-10 rounded mr-2 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.customColors.text}
                            onChange={(e) => updateSetting('customColors', {
                              ...settings.customColors,
                              text: e.target.value
                            })}
                            className={`px-2 py-1 border rounded w-24 ${settings.highContrast ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <div className="p-4 rounded-lg" style={{
                          backgroundColor: settings.customColors.background,
                          color: settings.customColors.text,
                          border: '1px solid #ccc'
                        }}>
                          <h4 style={{ color: settings.customColors.primary }} className="font-bold mb-2">Preview</h4>
                          <p className="mb-2">This is how your custom colors will look.</p>
                          <button style={{
                            backgroundColor: settings.customColors.primary,
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            marginRight: '0.5rem'
                          }}>Primary Button</button>
                          <button style={{
                            backgroundColor: settings.customColors.secondary,
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem'
                          }}>Secondary Button</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>
          
          {/* Audio & Voice */}
          <CollapsibleSection title="Audio & Voice" icon="🎙️" defaultOpen={true}>
            <div className="space-y-6">
              {/* Voice Announcements */}
              <ToggleSwitch
                checked={settings.voiceAnnouncements}
                onChange={(checked) => updateSetting('voiceAnnouncements', checked)}
                label="Voice Announcements"
                description="Hear ETA and bus information aloud"
              />
              
              {/* Text-to-Speech Speed Slider */}
              {settings.voiceAnnouncements && (
                <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className={`block mb-3 text-sm font-medium ${textClass} flex items-center gap-2`}>
                    <span role="img" aria-label="Speed" className="text-lg">⏱️</span>
                    Text-to-Speech Speed
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs ${subtextClass} flex items-center`}>
                      <span role="img" aria-label="Slow" className="mr-1">🐢</span> Slow
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={settings.textToSpeechSpeed}
                      onChange={(e) => updateSetting('textToSpeechSpeed', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className={`text-xs ${subtextClass} flex items-center`}>
                      Fast <span role="img" aria-label="Fast" className="ml-1">🐇</span>
                    </span>
                    <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      {settings.textToSpeechSpeed.toFixed(1)}x
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <motion.button
                      onClick={testVoiceAnnouncement}
                      disabled={isTestingVoice}
                      whileHover={{ scale: isTestingVoice ? 1 : 1.03 }}
                      whileTap={{ scale: isTestingVoice ? 1 : 0.97 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {isTestingVoice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Testing Voice...
                        </>
                      ) : (
                        <>
                          <span role="img" aria-label="Speaker" className="text-lg">🔊</span> Test Voice Announcement
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              )}
              
              {/* Voice Presets */}
              {settings.voiceAnnouncements && (
                <div className="mt-2">
                  <label className={`block mb-2 text-sm font-medium ${textClass}`}>Voice Preset:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Default', 'Clear', 'Friendly', 'Professional'].map((voice) => (
                      <motion.button
                        key={voice}
                        onClick={() => updateSetting('voicePreset', voice)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${voice === (settings.voicePreset || 'Default') 
                          ? 'bg-blue-600 text-white'
                          : settings.highContrast
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {voice}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Screen Reader Support */}
              <ToggleSwitch
                checked={settings.screenReader}
                onChange={(checked) => updateSetting('screenReader', checked)}
                label="Screen Reader Optimization"
                description="Enhanced compatibility with screen readers"
              />
              
              {/* Audio Cues */}
              <ToggleSwitch
                checked={settings.audioCues}
                onChange={(checked) => updateSetting('audioCues', checked)}
                label="Audio Cues"
                description="Play sounds for important notifications and events"
              />
            </div>
          </CollapsibleSection>
          
          {/* Language Settings */}
          <CollapsibleSection title="🌍 Language & Regional" icon="🌍" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>
                  Display Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    settings.highContrast ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={`p-4 rounded-lg ${settings.highContrast ? 'bg-gray-800' : 'bg-blue-50'}`}>
                <div className={`text-sm font-medium ${settings.highContrast ? 'text-blue-300' : 'text-blue-800'} mb-2`}>
                  Language Features
                </div>
                <ul className={`text-sm space-y-1 ${settings.highContrast ? 'text-gray-300' : 'text-blue-700'}`}>
                  <li>• Real-time translation of bus information</li>
                  <li>• Voice announcements in selected language</li>
                  <li>• Right-to-left text support (coming soon)</li>
                  <li>• Regional number and date formats</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
          
          {/* Emergency Features */}
          <CollapsibleSection title="🆘 Emergency & Safety" icon="🚨" defaultOpen={false}>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${settings.highContrast ? 'bg-red-900' : 'bg-red-50'}`}>
                <div className={`text-sm font-medium ${settings.highContrast ? 'text-red-300' : 'text-red-800'} mb-2`}>
                  Emergency Features
                </div>
                <ul className={`text-sm space-y-1 ${settings.highContrast ? 'text-red-200' : 'text-red-700'}`}>
                  <li>• Emergency contact quick dial</li>
                  <li>• Location sharing with emergency services</li>
                  <li>• Offline emergency information access</li>
                  <li>• SOS button with voice activation</li>
                </ul>
              </div>
              
              <button 
                onClick={() => setShowEmergencyModal(true)}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <span role="img" aria-label="SOS">🆘</span> Configure Emergency Settings
              </button>
              
              {settings.emergencyContacts && settings.emergencyContacts.length > 0 && settings.emergencyContacts[0].name && (
                <div className="mt-4 p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                  <h5 className="font-medium mb-2">Configured Contacts:</h5>
                  <ul className="space-y-2">
                    {settings.emergencyContacts.map((contact, index) => (
                      contact.name && (
                        <li key={index} className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({contact.relationship})</span>
                          </div>
                          <span>{contact.phone}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>
        
        {/* Preview Section */}
        <CollapsibleSection title="🔍 Preview Your Settings" icon="👁️" defaultOpen={true}>
          <div className={`p-6 rounded-lg border-2 border-dashed ${
            settings.highContrast ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="mb-4">
              <div className={`text-lg font-semibold ${textClass} mb-1`} style={{ 
                fontSize: settings.fontSize === 'large' ? '1.25rem' : 
                         settings.fontSize === 'larger' ? '1.5rem' : '1rem',
                lineHeight: settings.lineSpacing === 'comfortable' ? '1.8' : 
                            settings.lineSpacing === 'spacious' ? '2.2' : '1.5',
                fontFamily: settings.fontFamily
              }}>
                Sample Bus Information
              </div>
              <div className={`${subtextClass} mb-3`} style={{ 
                fontSize: settings.fontSize === 'large' ? '1.1rem' : 
                         settings.fontSize === 'larger' ? '1.25rem' : '0.9rem',
                lineHeight: settings.lineSpacing === 'comfortable' ? '1.8' : 
                            settings.lineSpacing === 'spacious' ? '2.2' : '1.5',
                fontFamily: settings.fontFamily
              }}>
                Bus 12A arriving at Central Station in 3 minutes
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className={`flex items-center gap-2 ${subtextClass} p-2 rounded ${
                settings.highContrast ? 'bg-gray-700' : 'bg-white'
              }`}>
                <span className={`inline-block w-4 h-4 rounded-full ${
                  settings.colorBlindSupport ? 'bg-green-500 border-2 border-gray-800' : 'bg-green-500'
                }`}></span>
                <span style={{ 
                  fontSize: settings.fontSize === 'large' ? '1rem' : 
                           settings.fontSize === 'larger' ? '1.1rem' : '0.875rem'
                }}>
                  Crowd Level: Low {settings.colorBlindSupport && '(Pattern: Dotted)'}
                </span>
              </div>
              
              <div className={`flex items-center gap-2 ${subtextClass} p-2 rounded ${
                settings.highContrast ? 'bg-gray-700' : 'bg-white'
              }`}>
                <span className={`inline-block w-4 h-4 rounded-full ${
                  settings.colorBlindSupport ? 'bg-yellow-500 border-2 border-gray-800 bg-opacity-80' : 'bg-yellow-500'
                }`}></span>
                <span style={{ 
                  fontSize: settings.fontSize === 'large' ? '1rem' : 
                           settings.fontSize === 'larger' ? '1.1rem' : '0.875rem'
                }}>
                  Delay Status: Minor {settings.colorBlindSupport && '(Pattern: Striped)'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button className={`px-4 py-2 rounded-lg ${
                settings.highContrast 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors`} style={{
                fontSize: settings.fontSize === 'large' ? '1rem' : 
                         settings.fontSize === 'larger' ? '1.1rem' : '0.875rem'
              }}>
                <motion.div 
                  whileHover={{ scale: settings.reduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: settings.reduceMotion ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span role="img" aria-label="Map">🗺️</span> View Route Map
                </motion.div>
              </button>
              
              <button className={`px-4 py-2 rounded-lg ${
                settings.highContrast 
                  ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-500' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
              } transition-colors`} style={{
                fontSize: settings.fontSize === 'large' ? '1rem' : 
                         settings.fontSize === 'larger' ? '1.1rem' : '0.875rem'
              }}>
                <motion.div 
                  whileHover={{ scale: settings.reduceMotion ? 1 : 1.05 }}
                  whileTap={{ scale: settings.reduceMotion ? 1 : 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <span role="img" aria-label="Bell">🔔</span> Set Alert
                </motion.div>
              </button>
            </div>
          </div>
        </CollapsibleSection>
      </div>
      </div>
    </PageFadeIn>
  )
}