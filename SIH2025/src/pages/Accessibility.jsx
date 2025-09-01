import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import PageFadeIn from '../components/PageFadeIn';

export default function Accessibility() {
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    voiceAnnouncements: false,
    reduceMotion: false,
    screenReader: false,
    colorBlindSupport: false,
    language: 'en',
    fontSize: 'medium',
    theme: 'light'
  })
  
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
  
  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings))
    
    // Apply settings to document
    applySettings(settings)
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
    
    utterance.onend = () => setIsTestingVoice(false)
    utterance.onerror = () => setIsTestingVoice(false)
    
    speechSynthesis.speak(utterance)
  }
  
  const resetSettings = () => {
    const defaultSettings = {
      largeText: false,
      highContrast: false,
      voiceAnnouncements: false,
      reduceMotion: false,
      screenReader: false,
      colorBlindSupport: false,
      language: 'en',
      fontSize: 'medium',
      theme: 'light'
    }
    setSettings(defaultSettings)
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
            </div>
            
            <button
              onClick={resetSettings}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Accessibility */}
          <div className={cardClass}>
            <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center gap-2`}>
              👁️ Visual Accessibility
            </h2>
            
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
              
              {/* High Contrast */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${textClass}`}>High Contrast Mode</span>
                  <p className={`text-sm ${subtextClass}`}>Increase contrast for better visibility</p>
                </div>
              </label>
              
              {/* Reduce Motion */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => updateSetting('reduceMotion', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${textClass}`}>Reduce Motion</span>
                  <p className={`text-sm ${subtextClass}`}>Minimize animations and transitions</p>
                </div>
              </label>
              
              {/* Color Blind Support */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.colorBlindSupport}
                  onChange={(e) => updateSetting('colorBlindSupport', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${textClass}`}>Color Blind Support</span>
                  <p className={`text-sm ${subtextClass}`}>Use patterns and symbols alongside colors</p>
                </div>
              </label>
              
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
              </div>
            </div>
          </div>
          
          {/* Audio & Voice */}
          <div className={cardClass}>
            <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center gap-2`}>
              🎙️ Audio & Voice
            </h2>
            
            <div className="space-y-4">
              {/* Voice Announcements */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.voiceAnnouncements}
                  onChange={(e) => updateSetting('voiceAnnouncements', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${textClass}`}>Voice Announcements</span>
                  <p className={`text-sm ${subtextClass}`}>Hear ETA and bus information aloud</p>
                </div>
              </label>
              
              {/* Test Voice */}
              <button
                onClick={testVoiceAnnouncement}
                disabled={isTestingVoice || !settings.voiceAnnouncements}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isTestingVoice ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Testing Voice...
                  </>
                ) : (
                  <>
                    🔊 Test Voice Announcement
                  </>
                )}
              </button>
              
              {/* Screen Reader Support */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.screenReader}
                  onChange={(e) => updateSetting('screenReader', e.target.checked)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className={`font-medium ${textClass}`}>Screen Reader Optimization</span>
                  <p className={`text-sm ${subtextClass}`}>Enhanced compatibility with screen readers</p>
                </div>
              </label>
            </div>
          </div>
          
          {/* Language Settings */}
          <div className={cardClass}>
            <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center gap-2`}>
              🌍 Language & Regional
            </h2>
            
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
          </div>
          
          {/* Emergency Features */}
          <div className={cardClass}>
            <h2 className={`text-xl font-semibold ${textClass} mb-4 flex items-center gap-2`}>
              🆘 Emergency & Safety
            </h2>
            
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
              
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                🆘 Configure Emergency Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className={cardClass + ' mt-6'}>
          <h2 className={`text-xl font-semibold ${textClass} mb-4`}>
            🔍 Preview Your Settings
          </h2>
          
          <div className={`p-4 rounded-lg border-2 border-dashed ${
            settings.highContrast ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className={`text-lg font-semibold ${textClass} mb-2`}>
              Sample Bus Information
            </div>
            <div className={`${subtextClass} mb-2`}>
              Bus 12A arriving at Central Station in 3 minutes
            </div>
            <div className={`flex items-center gap-2 ${subtextClass}`}>
              <span className={`inline-block w-3 h-3 rounded-full ${
                settings.colorBlindSupport ? 'bg-green-500 border-2 border-gray-800' : 'bg-green-500'
              }`}></span>
              Crowd Level: Low {settings.colorBlindSupport && '(Pattern: Dotted)'}
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageFadeIn>
  )
}