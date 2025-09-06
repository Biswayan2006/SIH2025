import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoading } from '../context/LoadingContext'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { setLoading } = useLoading()
  const [error, setError] = useState(null)

  useEffect(() => {
    // Show loading state while processing authentication
    setLoading(true)
    
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userDataString = urlParams.get('user')
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      console.error('Authentication error:', errorParam)
      setError(`Authentication failed: ${errorParam}`)
      setTimeout(() => {
        setLoading(false)
        navigate('/login?error=' + errorParam, { replace: true })
      }, 1500)
      return
    }

    if (token && userDataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataString))
        
        // Use AuthContext login function to properly set authentication state
        login(userData, token)
        
        // Show success message briefly then redirect to home
        setTimeout(() => {
          setLoading(false)
          navigate('/', { replace: true })
        }, 1500)
      } catch (error) {
        console.error('Error parsing user data:', error)
        setError('Invalid authentication response')
        setTimeout(() => {
          setLoading(false)
          navigate('/login?error=invalid_response', { replace: true })
        }, 1500)
      }
    } else {
      setError('Missing authentication data')
      setTimeout(() => {
        setLoading(false)
        navigate('/login?error=missing_data', { replace: true })
      }, 1500)
    }
  }, [navigate, login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        {error ? (
          <>
            <div className="text-red-500 text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <p className="text-gray-600 dark:text-gray-400">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Authentication Successful!</h2>
            <p className="text-gray-600 dark:text-gray-400">Redirecting you to the home page...</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthSuccess