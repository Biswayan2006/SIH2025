import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userDataString = urlParams.get('user')

    if (token && userDataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataString))
        
        // Store token and user data in localStorage
        localStorage.setItem('authToken', token)
        localStorage.setItem('userData', JSON.stringify(userData))
        
        // Redirect to dashboard or home
        navigate('/', { replace: true })
      } catch (error) {
        console.error('Error parsing user data:', error)
        navigate('/login?error=invalid_response', { replace: true })
      }
    } else {
      navigate('/login?error=missing_data', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthSuccess