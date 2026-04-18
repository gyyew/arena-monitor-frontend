import { createContext, useState, useEffect, useContext } from 'react'
import { authApi, setAuthToken, getAuthToken, removeAuthToken, setUser, getUser, removeUser } from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const login = async (phone, password) => {
    try {
      const response = await authApi.login(phone, password)
      
      // Extract token from response (adjust based on actual backend response structure)
      const token = response.token || response.data?.token || response.data
      
      if (token) {
        setAuthToken(token)
        setToken(token)
        
        // Fetch user data after login
        const userData = await authApi.getCurrentUser()
        setUserState(userData)
        setUser(userData)
        
        console.log('Login successful!')
        return { success: true }
      } else {
        console.error('Login failed: No token received')
        return { success: false }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Login failed'
      console.error('Login error:', errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const register = async (phone, password, nickname) => {
    try {
      await authApi.register(phone, password, nickname)
      console.log('Registration successful! Please login.')
      return { success: true }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      console.error('Registration error:', errorMsg)
      return { success: false, error: errorMsg }
    }
  }

  const updateUserInfo = async (nickname, avatar, sportPreference, intro) => {
    try {
      const response = await authApi.updateUserInfo(nickname, avatar, sportPreference, intro)
      if (response.success) {
        const updatedUser = response.data
        setUserState(updatedUser)
        setUser(updatedUser)
        return { success: true, user: updatedUser }
      }
      return { success: false, message: response.message || 'Update failed' }
    } catch (error) {
      console.error('Update user info error:', error)
      return { success: false, message: error.response?.data?.message || 'Update failed' }
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await authApi.changePassword(oldPassword, newPassword)
      if (response.success) {
        return { success: true }
      }
      return { success: false, message: response.message || 'Password change failed' }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, message: error.response?.data?.message || 'Password change failed' }
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
      console.log('Logged out successfully')
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUserInfo,
    changePassword,
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