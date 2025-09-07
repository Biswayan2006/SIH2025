import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useLanguage } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import { ScrollProvider } from './context/ScrollContext'
import './App.css'
import SplashScreen from './components/SplashScreen';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const { translate } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }
  
  return (
    <LoadingProvider>
      <ScrollProvider>
        <div className="min-h-dvh flex flex-col transition-colors duration-300 bg-white dark:bg-gray-900">
          <Navbar />
          <main id="main-content" className="flex-1 pt-16 relative overflow-hidden"> {/* Added pt-16 to prevent content from being hidden behind the fixed navbar and overflow-hidden for animations */}
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </ScrollProvider>
    </LoadingProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
