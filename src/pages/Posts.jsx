import { useState, useEffect } from 'react'
import { Card, Button, Typography, List, Avatar, Input, Form, Tag, Spin, message, Modal, Select } from 'antd'
import { PlusOutlined, UserOutlined, MessageOutlined, HeartOutlined, SendOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getPosts, createPost, likePost, commentPost } from '../api/post'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input
const { Option } = Select

const Posts = () => {
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
        setPosts(result.data)
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
        message.success('发帖成功')
        setShowCreateModal(false)
        createForm.resetFields()
        fetchPosts()
      } else {
        message.error(result.message || '发帖失败')
      }
    } catch (error) {
      message.error('发帖失败，请稍后重试')
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>球友社区</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowCreateModal(true)}
        >
          发布帖子
        </Button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Select
          placeholder="按分类筛选"
          style={{ width: 200 }}
          value={selectedCategory}
          onChange={setSelectedCategory}
        >
          <Option value="">全部</Option>
          {categories.map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
      </div>

      <List
        itemLayout="vertical"
        loading={loading}
        dataSource={posts}
        renderItem={post => (
          <Card style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <Avatar icon={<UserOutlined />} />
              <div style={{ marginLeft: '12px' }}>
                <Text strong>{post.userNickname}</Text>
                <Text type="secondary" style={{ marginLeft: '8px' }}>
                  {new Date(post.createTime).toLocaleString()}
                </Text>
              </div>
              <Tag style={{ marginLeft: 'auto' }}>{post.category}</Tag>
            </div>
            
            <Title level={4}>{post.title}</Title>
            <Paragraph>{post.content}</Paragraph>
            
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              <Button 
                icon={<HeartOutlined />} 
                onClick={() => handleLike(post.postId)}
                type={post.liked ? 'primary' : 'default'}
              >
                点赞 ({post.likeCount})
              </Button>
              <Button 
                icon={<MessageOutlined />}
              >
                评论 ({post.commentCount})
              </Button>
            </div>
          </Card>
        )}
        locale={{ emptyText: '暂无帖子，快来发布第一条吧！' }}
      />

      <Modal
        title="发布帖子"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreatePost}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入帖子标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea rows={6} placeholder="请输入帖子内容" />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '8px' }}>
              发布
            </Button>
            <Button onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Posts