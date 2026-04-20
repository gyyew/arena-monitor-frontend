import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
})

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API functions
export const authApi = {
  login: async (phone, password) => {
    const response = await api.post('/users/login', new URLSearchParams({
      phone,
      password
    }))
    return response
  },

  register: async (phone, password, nickname) => {
    const response = await api.post('/users/register', new URLSearchParams({
      phone,
      password,
      nickname
    }))
    return response
  },

  logout: async () => {
    const response = await api.post('/users/logout')
    return response
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me')
    return response
  },

  updateUserInfo: async (nickname, avatar, sportPreference, intro) => {
    const response = await api.put('/users/me', new URLSearchParams({
      nickname,
      avatar,
      sportPreference,
      intro
    }))
    return response
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.put('/users/me/password', new URLSearchParams({
      oldPassword,
      newPassword
    }))
    return response
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/admin/${userId}`)
    return response
  },
}

// Token management helpers
export const setAuthToken = (token) => {
  localStorage.setItem('token', token)
}

export const getAuthToken = () => {
  return localStorage.getItem('token')
}

export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const removeUser = () => {
  localStorage.removeItem('user')
}

export default api