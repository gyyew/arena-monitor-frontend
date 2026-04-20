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

// Post API functions
export const postApi = {
  // Create post
  createPost: async (title, content, sportType, imageUrls) => {
    const response = await api.post('/posts', new URLSearchParams({
      title,
      content,
      sportType,
      imageUrls
    }))
    return response
  },

  // Update post
  updatePost: async (postId, title, content, sportType, imageUrls) => {
    const response = await api.put(`/posts/${postId}`, new URLSearchParams({
      title,
      content,
      sportType,
      imageUrls
    }))
    return response
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`)
    return response
  },

  // Get post by id
  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`)
    return response
  },

  // Get post list
  getPostList: async (page, size, sportType, keyword, auditStatus) => {
    const response = await api.get('/posts', {
      params: { page, size, sportType, keyword, auditStatus }
    })
    return response
  },

  // Get user posts
  getUserPosts: async (userId, page, size) => {
    const response = await api.get(`/posts/user/${userId}`, {
      params: { page, size }
    })
    return response
  },

  // Audit post
  auditPost: async (postId, auditStatus, rejectReason) => {
    const response = await api.put(`/posts/admin/audit/${postId}`, new URLSearchParams({
      auditStatus,
      rejectReason
    }))
    return response
  },

  // Create comment
  createComment: async (postId, content) => {
    const response = await api.post('/comments', new URLSearchParams({
      postId,
      content
    }))
    return response
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`)
    return response
  },

  // Get comments by post id
  getCommentsByPostId: async (postId, page, size) => {
    const response = await api.get(`/comments/post/${postId}`, {
      params: { page, size }
    })
    return response
  },

  // Get user comments
  getUserComments: async (userId, page, size) => {
    const response = await api.get(`/comments/user/${userId}`, {
      params: { page, size }
    })
    return response
  },

  // Send message
  sendMessage: async (receiveUserId, content) => {
    const response = await api.post('/messages', new URLSearchParams({
      receiveUserId,
      content
    }))
    return response
  },

  // Get user messages
  getUserMessages: async (otherUserId, page, size) => {
    const response = await api.get('/messages', {
      params: { otherUserId, page, size }
    })
    return response
  },

  // Get unread message count
  getUnreadMessageCount: async () => {
    const response = await api.get('/messages/unread/count')
    return response
  },

  // Mark message as read
  markMessageAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`)
    return response
  },

  // Mark all messages as read
  markAllMessagesAsRead: async (otherUserId) => {
    const response = await api.put('/messages/read/all', new URLSearchParams({
      otherUserId
    }))
    return response
  },

  // Delete message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`)
    return response
  },

  // Get conversation list
  getConversationList: async () => {
    const response = await api.get('/messages/conversations')
    return response
  },
}

// Export functions for easy usage
export const getPosts = async (params) => {
  const { category, page = 1, size = 10 } = params || {}
  return postApi.getPostList(page, size, category)
}

export const createPost = async (title, content, category) => {
  return postApi.createPost(title, content, category, '')
}

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`)
  return response
}

export const commentPost = async (postId, content) => {
  return postApi.createComment(postId, content)
}

export const getMessages = async () => {
  return postApi.getConversationList()
}

export const sendMessage = async (userId, content) => {
  return postApi.sendMessage(userId, content)
}

export default api
