import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import LiveTracking from './pages/LiveTracking.jsx'
import RoutesTimetable from './pages/RoutesTimetable.jsx'
import GreenScore from './pages/GreenScore.jsx'
import Feedback from './pages/Feedback.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import AuthSuccess from './pages/AuthSuccess.jsx'
import Accessibility from './pages/Accessibility.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import DriverDashboard from './pages/DriverDashboard.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import { GoogleOAuthProvider} from '@react-oauth/google'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'live', element: <LiveTracking /> },
      { path: 'routes', element: <RoutesTimetable /> },
      { path: 'green', element: <GreenScore /> },
      { path: 'profile', element: <Profile /> },
      { path: 'feedback', element: <Feedback /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'auth/success', element: <AuthSuccess /> },
      { path: 'accessibility', element: <Accessibility /> },
      { path: 'admin', element: <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute> },
      { path: 'driver', element: <ProtectedRoute allowedRoles={['driver']}><DriverDashboard /></ProtectedRoute> },
    ],
  },
])

import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'

// Get the Google Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
