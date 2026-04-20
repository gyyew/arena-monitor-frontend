import { useState, useEffect } from 'react'
import { Card, Button, Typography, List, Avatar, Input, Form, Tag, Spin, Modal, Select, App } from 'antd'
import { PlusOutlined, UserOutlined, MessageOutlined, HeartOutlined, FireOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getPosts, createPost, likePost, commentPost } from '../api/post'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const Posts = () => {
  const { message } = App.useApp()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState('')
  const categories = ['羽毛球', '篮球', '足球', '乒乓球', '其他']

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const result = await getPosts({ category: selectedCategory })
      if (result.success) {
        // 后端返回 IPage 对象，需要提取 records 数组
        setPosts(result.data.records || result.data)
      } else {
        message.error(result.message || '获取帖子失败')
      }
    } catch (error) {
      message.error('获取帖子失败，请稍后重试')
      console.error('Fetch posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (values) => {
    try {
      setLoading(true)
      const result = await createPost(
        values.title,
        values.content,
        values.category
      )
      if (result.success) {
        message.success('发布成功~')
        setShowCreateModal(false)
        createForm.resetFields()
        fetchPosts()
      } else {
        message.error(result.message || '发布失败')
      }
    } catch (error) {
      message.error('发布失败，请稍后重试')
      console.error('Create post error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const result = await likePost(postId)
      if (result.success) {
        setPosts(prev => prev.map(post => 
          post.postId === postId 
            ? { ...post, likeCount: post.likeCount + 1, liked: true }
            : post
        ))
      } else {
        message.error(result.message || '点赞失败')
      }
    } catch (error) {
      message.error('点赞失败，请稍后重试')
      console.error('Like post error:', error)
    }
  }

  const handleComment = async (postId, content) => {
    try {
      const result = await commentPost(postId, content)
      if (result.success) {
        setPosts(prev => prev.map(post => 
          post.postId === postId 
            ? { 
                ...post, 
                commentCount: post.commentCount + 1,
                comments: [...(post.comments || []), result.data]
              }
            : post
        ))
      } else {
        message.error(result.message || '评论失败')
      }
    } catch (error) {
      message.error('评论失败，请稍后重试')
      console.error('Comment post error:', error)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      '羽毛球': '#CE88FF',
      '篮球': '#F3EC46',
      '足球': '#67E0A3',
      '乒乓球': '#38CEC4',
      '其他': '#F964C2',
    }
    return colors[category] || '#CE88FF'
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <FireOutlined style={styles.headerEmoji} />
          </div>
          <div>
            <Title level={2} style={styles.title}>球友社区</Title>
            <Text style={styles.subtitle}>发现志同道合的运动伙伴</Text>
          </div>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowCreateModal(true)}
          style={styles.createBtn}
        >
          发布帖子
        </Button>
      </div>

      <div style={styles.filterSection}>
        <Select
          placeholder="筛选分类"
          style={{ width: 140 }}
          value={selectedCategory}
          onChange={setSelectedCategory}
          allowClear
        >
          {categories.map(category => (
            <Option key={category} value={category}>
              <Tag color={getCategoryColor(category)} style={{ margin: 0 }}>{category}</Tag>
            </Option>
          ))}
        </Select>
      </div>

      <Spin spinning={loading}>
        <List
          itemLayout="vertical"
          dataSource={posts}
          renderItem={post => (
            <Card style={styles.postCard}>
              <div style={styles.postHeader}>
                <Avatar 
                  size={48} 
                  icon={<UserOutlined />} 
                  style={styles.avatar}
                />
                <div style={styles.postMeta}>
                  <Text strong style={styles.nickname}>{post.userNickname}</Text>
                  <Text style={styles.time}>
                    {new Date(post.createTime).toLocaleString()}
                  </Text>
                </div>
                <Tag style={{ ...styles.categoryTag, background: getCategoryColor(post.category) + '20', color: getCategoryColor(post.category) }}>
                  {post.category}
                </Tag>
              </div>
              
              <Title level={4} style={styles.postTitle}>{post.title}</Title>
              <Paragraph style={styles.postContent}>{post.content}</Paragraph>
              
              <div style={styles.postActions}>
                <Button 
                  icon={<HeartOutlined />} 
                  onClick={() => handleLike(post.postId)}
                  type={post.liked ? 'primary' : 'default'}
                  style={post.liked ? styles.likedBtn : styles.actionBtn}
                >
                  {post.likeCount || 0}
                </Button>
                <Button 
                  icon={<MessageOutlined />}
                  style={styles.actionBtn}
                >
                  {post.commentCount || 0}
                </Button>
              </div>
            </Card>
          )}
          locale={{ emptyText: '暂无帖子，快来发布第一条吧！' }}
        />
      </Spin>

      <Modal
        title={<span style={styles.modalTitle}>发布新帖子</span>}
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        centered
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreatePost}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input 
              placeholder="帖子标题" 
              style={styles.modalInput}
            />
          </Form.Item>

          <Form.Item
            name="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="选择分类" style={styles.modalSelect}>
              {categories.map(category => (
                <Option key={category} value={category}>
                  <Tag color={getCategoryColor(category)}>{category}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea 
              rows={5} 
              placeholder="分享你的运动故事..." 
              style={styles.modalTextArea}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <div style={styles.modalActions}>
              <Button onClick={() => setShowCreateModal(false)} style={styles.cancelBtn}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} style={styles.submitBtn}>
                发布
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

const styles = {
  container: {
    padding: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px 24px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(206, 136, 255, 0.12)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #F964C2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(206, 136, 255, 0.35)',
  },
  headerEmoji: {
    fontSize: '28px',
    color: 'white',
  },
  title: {
    marginBottom: '4px',
    color: '#2A2438',
    fontWeight: '700',
  },
  subtitle: {
    color: '#8A80A0',
    fontSize: '14px',
  },
  createBtn: {
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #F3EC46 0%, #FBF8B3 100%)',
    border: 'none',
    color: '#2A2438',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(243, 236, 70, 0.4)',
  },
  filterSection: {
    marginBottom: '16px',
    display: 'flex',
    gap: '12px',
  },
  postCard: {
    borderRadius: '18px',
    marginBottom: '16px',
    boxShadow: '0 4px 16px rgba(206, 136, 255, 0.08)',
    border: '1px solid #E2D5F5',
    overflow: 'hidden',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  avatar: {
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
  },
  postMeta: {
    marginLeft: '12px',
    flex: 1,
  },
  nickname: {
    display: 'block',
    color: '#2A2438',
    fontSize: '15px',
  },
  time: {
    fontSize: '12px',
    color: '#B4A8CC',
  },
  categoryTag: {
    border: 'none',
    fontWeight: '500',
    borderRadius: '16px',
    padding: '2px 12px',
  },
  postTitle: {
    color: '#2A2438',
    marginBottom: '12px',
    fontWeight: '600',
  },
  postContent: {
    color: '#443B58',
    lineHeight: '1.8',
    marginBottom: '16px',
  },
  postActions: {
    display: 'flex',
    gap: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #E2D5F5',
  },
  actionBtn: {
    borderRadius: '20px',
    border: '1px solid #E2D5F5',
    color: '#8A80A0',
  },
  likedBtn: {
    borderRadius: '20px',
    background: '#F964C2',
    border: 'none',
    color: 'white',
  },
  modalTitle: {
    fontWeight: '600',
    color: '#2A2438',
    fontSize: '18px',
  },
  modalInput: {
    borderRadius: '12px',
    border: '1.5px solid #E2D5F5',
    height: '44px',
  },
  modalSelect: {
    borderRadius: '12px',
  },
  modalTextArea: {
    borderRadius: '12px',
    border: '1.5px solid #E2D5F5',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    borderRadius: '20px',
    border: '1px solid #E2D5F5',
    color: '#8A80A0',
  },
  submitBtn: {
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.35)',
  },
}

export default Posts
