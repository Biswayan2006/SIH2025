import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
// import { LoadingProvider } from './context/LoadingContext'
import './App.css'

function AppContent() {
  const { translate } = useLanguage();
  
  return (
    <ThemeProvider>
      <div className="min-h-dvh flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
          <footer className="border-t text-xs text-center py-4 text-gray-500 dark:text-gray-400 dark:border-gray-700">
            {translate('footer', { year: new Date().getFullYear() })}
          </footer>
      </div>
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
