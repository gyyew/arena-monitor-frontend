/**
 * API 请求模块模板
 * 
 * 本文件提供 axios 实例的标准配置模板
 * 所有新的 API 文件应基于此模板创建
 * 
 * @description axios 实例配置、拦截器定义、请求/响应处理
 * @usage 复制此模板创建新的 API 模块，确保 baseURL 统一为 '/api/v1'
 */

// ============================================
// 重要说明：禁止硬编码后端端口
// ============================================
// 开发环境：前端通过 Vite 代理转发请求，无需指定后端端口
// 生产环境：使用 Nginx 反向代理，统一入口为 '/api/v1'
// 
// 禁止出现类似 'http://localhost:8082' 的硬编码地址
// 所有后端服务调用通过代理或 Nginx 统一管理
// ============================================

import axios from 'axios'

/**
 * 创建 axios 实例
 * @description 统一配置 baseURL 和超时时间
 */
const api = axios.create({
  // 统一使用 /api/v1 前缀，通过 Vite 代理转发到后端服务
  baseURL: '/api/v1',
  // 请求超时时间 10 秒
  timeout: 10000,
})

/**
 * 请求拦截器
 * @description 自动添加 Authorization 头，处理 token 认证
 */
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 使用 Bearer 方案携带 token
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * @description 统一处理 401 未授权错误，自动跳转登录页
 */
api.interceptors.response.use(
  (response) => {
    // 返回 response.data 简化调用处处理
    return response.data
  },
  (error) => {
    // 统一处理 401 错误：清除登录信息并跳转登录页
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 使用 window.location 而非 router，确保跨组件生效
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// API 接口定义模板
// ============================================

/**
 * 示例 API 接口集合
 * @description 复制此对象到新文件，根据业务需求修改接口路径
 */
// export const exampleApi = {
//   /**
//    * 获取列表
//    * @param {number} page - 页码
//    * @param {number} size - 每页数量
//    * @returns {Promise} 请求 Promise
//    */
//   getList: async (page, size) => {
//     const response = await api.get('/endpoint', {
//       params: { page, size }
//     })
//     return response
//   },
//
//   /**
//    * 创建数据
//    * @param {Object} data - 请求体数据
//    * @returns {Promise} 请求 Promise
//    */
//   create: async (data) => {
//     const response = await api.post('/endpoint', data)
//     return response
//   },
//
//   /**
//    * 更新数据
//    * @param {string|number} id - 数据 ID
//    * @param {Object} data - 请求体数据
//    * @returns {Promise} 请求 Promise
//    */
//   update: async (id, data) => {
//     const response = await api.put(`/endpoint/${id}`, data)
//     return response
//   },
//
//   /**
//    * 删除数据
//    * @param {string|number} id - 数据 ID
//    * @returns {Promise} 请求 Promise
//    */
//   delete: async (id) => {
//     const response = await api.delete(`/endpoint/${id}`)
//     return response
//   },
// }

// ============================================
// 辅助函数模板
// ============================================

/**
 * 设置认证 token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  localStorage.setItem('token', token)
}

/**
 * 获取认证 token
 * @returns {string|null} token 字符串或 null
 */
export const getAuthToken = () => {
  return localStorage.getItem('token')
}

/**
 * 移除认证 token
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

/**
 * 设置用户信息
 * @param {Object} user - 用户信息对象
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息对象或 null
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 移除用户信息
 */
export const removeUser = () => {
  localStorage.removeItem('user')
}

// 导出 axios 实例供外部使用
export default api
