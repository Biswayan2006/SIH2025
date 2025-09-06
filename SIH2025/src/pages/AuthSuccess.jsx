import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userDataString = urlParams.get('user')

    if (token && userDataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataString))
        
        // Use AuthContext login function to properly set authentication state
        login(userData, token)
        
        // Show success message briefly then redirect to home
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 1000)
      } catch (error) {
        console.error('Error parsing user data:', error)
        navigate('/login?error=invalid_response', { replace: true })
      }
    } else {
      navigate('/login?error=missing_data', { replace: true })
    }
  }, [navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Authentication Successful!</h2>
        <p className="text-gray-600 dark:text-gray-400">Redirecting you to the home page...</p>
      </div>
    </div>
  )
}

export default AuthSuccess