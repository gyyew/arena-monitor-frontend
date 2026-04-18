import { useState, useEffect } from 'react'
import { Card, Button, Typography, Table, Tag, message, Spin, Modal, Form, Input, Select, Switch } from 'antd'
import { UserOutlined, DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, HomeOutlined, TeamOutlined, SettingOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography
const { Option } = Select

const Admin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [courts, setCourts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showCourtModal, setShowCourtModal] = useState(false)
  const [userForm] = Form.useForm()
  const [postForm] = Form.useForm()
  const [courtForm] = Form.useForm()

  // 检查用户是否为管理员
  useEffect(() => {
    if (user?.role !== 1) {
      message.error('您没有管理员权限')
      navigate('/')
    }
  }, [user, navigate])

  // 加载数据
  useEffect(() => {
    if (user?.role === 1) {
      if (activeTab === 'users') {
        fetchUsers()
      } else if (activeTab === 'posts') {
        fetchPosts()
      } else if (activeTab === 'courts') {
        fetchCourts()
      }
    }
  }, [activeTab, user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/user/list')
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      } else {
        message.error(result.message || '获取用户列表失败')
      }
    } catch (error) {
      message.error('获取用户列表失败，请稍后重试')
      console.error('Fetch users error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/post/list')
      const result = await response.json()
      if (result.success) {
        setPosts(result.data)
      } else {
        message.error(result.message || '获取帖子列表失败')
      }
    } catch (error) {
      message.error('获取帖子列表失败，请稍后重试')
      console.error('Fetch posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourts = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/court/list')
      const result = await response.json()
      if (result.success) {
        setCourts(result.data)
      } else {
        message.error(result.message || '获取场地列表失败')
      }
    } catch (error) {
      message.error('获取场地列表失败，请稍后重试')
      console.error('Fetch courts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, status) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ userId, status: status ? 1 : 0 }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('状态更新成功')
        fetchUsers()
      } else {
        message.error(result.message || '状态更新失败')
      }
    } catch (error) {
      message.error('状态更新失败，请稍后重试')
      console.error('Update user status error:', error)
    }
  }

  const handlePostStatusChange = async (postId, status) => {
    try {
      const response = await fetch('http://localhost:8080/api/post/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ postId, status: status ? 1 : 0 }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('状态更新成功')
        fetchPosts()
      } else {
        message.error(result.message || '状态更新失败')
      }
    } catch (error) {
      message.error('状态更新失败，请稍后重试')
      console.error('Update post status error:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ userId }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('用户删除成功')
        fetchUsers()
      } else {
        message.error(result.message || '用户删除失败')
      }
    } catch (error) {
      message.error('用户删除失败，请稍后重试')
      console.error('Delete user error:', error)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch('http://localhost:8080/api/post/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ postId }),
      })
      const result = await response.json()
      if (result.success) {
        message.success('帖子删除成功')
        fetchPosts()
      } else {
        message.error(result.message || '帖子删除失败')
      }
    } catch (error) {
      message.error('帖子删除失败，请稍后重试')
      console.error('Delete post error:', error)
    }
  }

  const userColumns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '运动偏好',
      dataIndex: 'sportPreference',
      key: 'sportPreference',
      render: (text) => text || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 1 ? 'red' : 'blue'}>
          {role === 1 ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 0}
          onChange={(checked) => handleUserStatusChange(record.userId, checked)}
          checkedChildren="正常"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setSelectedUser(record)
              userForm.setFieldsValue(record)
              setShowUserModal(true)
            }}
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeleteUser(record.userId)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  const postColumns = [
    {
      title: '帖子ID',
      dataIndex: 'postId',
      key: 'postId',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'userNickname',
      key: 'userNickname',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handlePostStatusChange(record.postId, checked)}
          checkedChildren="发布"
          unCheckedChildren="草稿"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setSelectedPost(record)
              postForm.setFieldsValue(record)
              setShowPostModal(true)
            }}
          >
            编辑
          </Button>
          <Button 
            type="danger" 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDeletePost(record.postId)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  const courtColumns = [
    {
      title: '场地ID',
      dataIndex: 'courtId',
      key: 'courtId',
    },
    {
      title: '场地名称',
      dataIndex: 'courtName',
      key: 'courtName',
    },
    {
      title: '场地类型',
      dataIndex: 'courtType',
      key: 'courtType',
      render: (type) => <Tag color={type === '羽毛球' ? 'blue' : 'green'}>{type}</Tag>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="default" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => {
              setSelectedCourt(record)
              courtForm.setFieldsValue(record)
              setShowCourtModal(true)
            }}
          >
            编辑
          </Button>
        </div>
      ),
    },
  ]

  if (user?.role !== 1) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Text type="error">您没有管理员权限</Text>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>管理员后台</Title>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Button
          type={activeTab === 'users' ? 'primary' : 'default'}
          icon={<UserOutlined />}
          onClick={() => setActiveTab('users')}
        >
          用户管理
        </Button>
        <Button
          type={activeTab === 'posts' ? 'primary' : 'default'}
          icon={<TeamOutlined />}
          onClick={() => setActiveTab('posts')}
        >
          帖子审核
        </Button>
        <Button
          type={activeTab === 'courts' ? 'primary' : 'default'}
          icon={<HomeOutlined />}
          onClick={() => setActiveTab('courts')}
        >
          场地管理
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card>
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey="userId"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {activeTab === 'posts' && (
        <Card>
          <Table
            columns={postColumns}
            dataSource={posts}
            rowKey="postId"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      {activeTab === 'courts' && (
        <Card>
          <Table
            columns={courtColumns}
            dataSource={courts}
            rowKey="courtId"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}

      <Modal
        title="编辑用户"
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
      >
        <Form form={userForm} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="sportPreference" label="运动偏好">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select>
              <Option value={0}>普通用户</Option>
              <Option value={1}>管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              保存
            </Button>
            <Button onClick={() => setShowUserModal(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑帖子"
        open={showPostModal}
        onCancel={() => setShowPostModal(false)}
        footer={null}
      >
        <Form form={postForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select>
              <Option value="羽毛球">羽毛球</Option>
              <Option value="篮球">篮球</Option>
              <Option value="足球">足球</Option>
              <Option value="乒乓球">乒乓球</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              保存
            </Button>
            <Button onClick={() => setShowPostModal(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑场地"
        open={showCourtModal}
        onCancel={() => setShowCourtModal(false)}
        footer={null}
      >
        <Form form={courtForm} layout="vertical">
          <Form.Item name="courtName" label="场地名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="courtType" label="场地类型" rules={[{ required: true }]}>
            <Select>
              <Option value="羽毛球">羽毛球</Option>
              <Option value="篮球">篮球</Option>
              <Option value="足球">足球</Option>
              <Option value="乒乓球">乒乓球</Option>
            </Select>
          </Form.Item>
          <Form.Item name="location" label="位置" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              保存
            </Button>
            <Button onClick={() => setShowCourtModal(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Admin