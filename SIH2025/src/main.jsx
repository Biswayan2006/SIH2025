import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import LiveTracking from './pages/LiveTracking.jsx'
import RoutesTimetable from './pages/RoutesTimetable.jsx'
import GreenScore from './pages/GreenScore.jsx'
import Feedback from './pages/Feedback.jsx'
import Login from './pages/Login.jsx'
import Accessibility from './pages/Accessibility.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Profile from './pages/Profile.jsx'

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
      { path: 'accessibility', element: <Accessibility /> },
      { path: 'admin', element: <AdminDashboard /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
