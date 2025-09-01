import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import './App.css'
import SplashScreen from './components/SplashScreen';
import { useState } from 'react';

function AppContent() {
  const { translate } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }
  
  return (
    <ThemeProvider>
      <LoadingProvider>
        <div className="min-h-dvh flex flex-col transition-colors duration-300">
          <Navbar />
          <main id="main-content" className="flex-1 pt-16"> {/* Added pt-16 to prevent content from being hidden behind the fixed navbar */}
            <Outlet />
          </main>
          <Footer />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
