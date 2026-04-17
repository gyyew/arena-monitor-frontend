import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.message)
    return Promise.reject(error)
  }
)

export const courtApi = {
  getAllCourts: () => api.get('/v1/courts'),
  getCourt: (id) => api.get(`/v1/courts/${id}`),
  updateStatus: (id, status) => api.put(`/v1/courts/${id}/status?status=${status}`),
}

export default api