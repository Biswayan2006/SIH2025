import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { LoadingProvider } from './context/LoadingContext'
import './App.css'

function AppContent() {
  const { translate } = useLanguage();
  
  return (
    <ThemeProvider>
      <LoadingProvider>
        <div className="min-h-dvh flex flex-col transition-colors duration-300">
          <Navbar />
          <main id="main-content" className="flex-1">
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
