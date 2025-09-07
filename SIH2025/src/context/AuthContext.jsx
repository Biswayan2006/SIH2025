import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData)
        setUser(parsedUserData)
        setIsAuthenticated(true)
        
        // Optionally verify token with backend
        verifyToken(token)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
    
    setIsLoading(false)
  }, [])

  // Verify token with backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:4002/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Token verification failed')
      }

      const data = await response.json()
      if (data.success) {
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Token verification error:', error)
      logout()
    }
  }

  // Login function
  const login = (userData, token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        await fetch('http://localhost:4002/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // Get auth token
  const getToken = () => {
    return localStorage.getItem('authToken')
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext