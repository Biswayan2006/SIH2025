import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
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
          <Footer />
        </div>
      </LoadingProvider>
    </ThemeProvider>
  )
}

export default App
