import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import { ScrollProvider } from './context/ScrollContext'
import './App.css'
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }
  
  return (
    <ThemeProvider>
      <LoadingProvider>
        <ScrollProvider>
          <div className="min-h-dvh flex flex-col transition-colors duration-300">
            <Navbar />
            <main id="main-content" className="flex-1 pt-16 relative overflow-hidden"> {/* Added overflow-hidden for animations */}
              <AnimatePresence mode="wait">
                <Outlet key={location.pathname} />
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </ScrollProvider>
      </LoadingProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <AppContent />
  )
}

export default App
