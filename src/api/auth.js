import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
  login: async (username, password) => {
    const response = await api.post('/v1/users/login', null, {
      params: { username, password },
    })
    return response
  },

  register: async (username, password, phone) => {
    const response = await api.post('/v1/users/register', null, {
      params: { username, password, phone },
    })
    return response
  },

  logout: async () => {
    const response = await api.post('/v1/users/logout')
    return response
  },

  getCurrentUser: async () => {
    const response = await api.get('/v1/users/me')
    return response
  },

  getUserByUsername: async (username) => {
    const response = await api.get(`/v1/users/${username}`)
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