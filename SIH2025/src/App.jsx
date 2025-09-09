import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { ThemeProvider } from './context/ThemeContext'
import { LoadingProvider } from './context/LoadingContext'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <div className="min-h-dvh flex flex-col transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="border-t text-xs text-center py-4 text-gray-500 dark:text-gray-400 dark:border-gray-700">
            © {new Date().getFullYear()} TransitTrack
          </footer>
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
