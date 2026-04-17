import { createContext, useState, useEffect, useContext } from 'react'
import { useApp } from 'antd'
import { authApi, setAuthToken, getAuthToken, removeAuthToken, setUser, getUser, removeUser } from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const { message } = useApp()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = getAuthToken()
      const savedUser = getUser()

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUserState(savedUser)
        
        // Verify token is still valid by fetching current user
        try {
          const userData = await authApi.getCurrentUser()
          setUserState(userData)
          setUser(userData)
        } catch (error) {
          // Token is invalid, clear auth state
          console.log('Token expired, clearing auth state')
          removeAuthToken()
          removeUser()
          setToken(null)
          setUserState(null)
        }
      }
      
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password)
      
      // Extract token from response (adjust based on actual backend response structure)
      const token = response.token || response.data?.token || response.data
      
      if (token) {
        setAuthToken(token)
        setToken(token)
        
        // Fetch user data after login
        const userData = await authApi.getCurrentUser()
        setUser(userData)
        setUser(userData)
        
        message.success('Login successful!')
        return { success: true }
      } else {
        message.error('Login failed: No token received')
        return { success: false }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Login failed'
      message.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const register = async (username, password, phone) => {
    try {
      await authApi.register(username, password, phone)
      message.success('Registration successful! Please login.')
      return { success: true }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      message.error(errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout API errors, just clear local state
      console.log('Logout API error (ignoring):', error)
    } finally {
      // Always clear local auth state
      removeAuthToken()
      removeUser()
      setToken(null)
      setUserState(null)
      message.info('Logged out successfully')
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext