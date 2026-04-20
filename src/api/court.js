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

// Court API functions
export const courtApi = {
  // Get all courts
  getAllCourts: async () => {
    const response = await api.get('/courts')
    return response
  },

  // Get court by id
  getCourtById: async (courtId) => {
    const response = await api.get(`/courts/${courtId}`)
    return response
  },

  // Add court
  addCourt: async (court) => {
    const response = await api.post('/courts', court)
    return response
  },

  // Update court
  updateCourt: async (courtId, court) => {
    const response = await api.put(`/courts/${courtId}`, court)
    return response
  },

  // Delete court
  deleteCourt: async (courtId) => {
    const response = await api.delete(`/courts/${courtId}`)
    return response
  },

  // Get latest monitor data for a court
  getLatestMonitorData: async (courtId) => {
    const response = await api.get(`/courts/${courtId}/monitor/latest`)
    return response
  },

  // Get history monitor data for a court
  getHistoryMonitorData: async (courtId, startTime, endTime, page, size) => {
    const response = await api.get(`/courts/${courtId}/monitor/history`, {
      params: { startTime, endTime, page, size }
    })
    return response
  },

  // Get all latest monitor data
  getAllLatestMonitorData: async () => {
    const response = await api.get('/courts/monitor/all')
    return response
  },
}

// Get court history data for all courts
export const getCourtHistory = async (params) => {
  const response = await api.get('/courts/monitor/history', { params })
  return response
}

export default api
