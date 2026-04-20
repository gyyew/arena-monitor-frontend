/**
 * @file Admin.jsx
 * @description 管理后台页面组件，包含移动端优化的用户管理、帖子审核和场地管理功能
 * @dependencies antd, @ant-design/icons
 */

import { useState, useEffect } from 'react'
import { Card, Button, Typography, Table, Tag, message, Spin, Modal, Form, Input, Select, Switch } from 'antd'
import { UserOutlined, DeleteOutlined, EditOutlined, TeamOutlined, HomeOutlined, SettingOutlined, CrownOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

/**
 * 管理后台页面组件
 * 移动端优化的管理员功能面板
 */
const Admin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [courts, setCourts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userForm] = Form.useForm()

  useEffect(() => {
    if (user?.role !== 1) {
      message.error('您没有管理员权限')
      navigate('/')
    }
  }, [user, navigate])

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
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        // 后端返回 IPage 对象，需要提取 records 数组
        setUsers(result.data.records || result.data || [])
      } else {
        message.error(result.message || '获取用户列表失败')
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/posts/audit-list', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        // 后端返回 IPage 对象，需要提取 records 数组
        setPosts(result.data.records || result.data || [])
      } else {
        message.error(result.message || '获取帖子列表失败')
      }
    } catch (error) {
      console.error('Fetch posts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCourts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/v1/courts', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        const courtList = result.data.records || result.data || []
        setCourts(courtList)
      } else {
        message.error(result.message || '获取场地列表失败')
      }
    } catch (error) {
      console.error('Fetch courts error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatusChange = async (userId, status) => {
    try {
      const response = await fetch(`/api/v1/users/admin/disable/${userId}?status=${status ? 0 : 1}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        message.success('状态更新成功')
        fetchUsers()
      } else {
        message.error(result.message || '状态更新失败')
      }
    } catch (error) {
      console.error('Update user status error:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/v1/users/admin/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        message.success('用户删除成功')
        fetchUsers()
      } else {
        message.error(result.message || '用户删除失败')
      }
    } catch (error) {
      console.error('Delete user error:', error)
    }
  }

  if (user?.role !== 1) {
    return (
      <div style={styles.noPermission}>
        <div style={styles.noPermissionIcon}>🔒</div>
        <Text type="secondary">您没有管理员权限</Text>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* 页面头部 */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <SettingOutlined style={styles.headerIcon} />
          <Title level={4} style={styles.title}>管理中心</Title>
        </div>
      </div>

      {/* Tab切换按钮 - 移动端横向滚动 */}
      <div style={styles.tabButtons}>
        <Button
          type={activeTab === 'users' ? 'primary' : 'default'}
          icon={<TeamOutlined />}
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? styles.activeTab : styles.tabBtn}
          size="small"
        >
          用户
        </Button>
        <Button
          type={activeTab === 'posts' ? 'primary' : 'default'}
          icon={<EditOutlined />}
          onClick={() => setActiveTab('posts')}
          style={activeTab === 'posts' ? styles.activeTab : styles.tabBtn}
          size="small"
        >
          帖子
        </Button>
        <Button
          type={activeTab === 'courts' ? 'primary' : 'default'}
          icon={<HomeOutlined />}
          onClick={() => setActiveTab('courts')}
          style={activeTab === 'courts' ? styles.activeTab : styles.tabBtn}
          size="small"
        >
          场地
        </Button>
      </div>

      {/* 数据表格 */}
      <Spin spinning={loading}>
        <Card style={styles.tableCard} styles={{ body: { padding: '12px' } }}>
          {activeTab === 'users' && (
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="userId"
              pagination={{ pageSize: 5, size: 'small' }}
              size="small"
              scroll={{ x: 400 }}
            />
          )}
          {activeTab === 'posts' && (
            <Table
              columns={postColumns}
              dataSource={posts}
              rowKey="postId"
              pagination={{ pageSize: 5, size: 'small' }}
              size="small"
              scroll={{ x: 300 }}
            />
          )}
          {activeTab === 'courts' && (
            <Table
              columns={courtColumns}
              dataSource={courts}
              rowKey="courtId"
              pagination={{ pageSize: 5, size: 'small' }}
              size="small"
              scroll={{ x: 250 }}
            />
          )}
        </Card>
      </Spin>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={showUserModal}
        onCancel={() => setShowUserModal(false)}
        footer={null}
        centered
        width="90%"
      >
        <Form form={userForm} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true }]}>
            <Input style={styles.modalInput} />
          </Form.Item>
          <div style={styles.modalActions}>
            <Button onClick={() => setShowUserModal(false)} style={styles.cancelBtn}>取消</Button>
            <Button type="primary" htmlType="submit" style={styles.submitBtn}>保存</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )

  // 用户列表列定义
  const userColumns = [
    {
      title: '用户',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={styles.avatarIcon}>
            <UserOutlined />
          </div>
          <div>
            <Text strong style={{ fontSize: '13px' }}>{text}</Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '11px' }}>{record.phone}</Text>
          </div>
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag style={role === 1 ? styles.adminTag : styles.userTag}>
          {role === 1 ? <><CrownOutlined /> 管理员</> : '用户'}
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
          style={styles.switch}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={() => handleDeleteUser(record.userId)}
        />
      ),
    },
  ]

  // 帖子列表列定义
  const postColumns = [
    {
      title: '帖子',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '13px' }}>{text}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: '11px' }}>
            by {record.userNickname}
          </Text>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag style={styles.categoryTag}>{category}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag style={status === 1 ? styles.freeTag : styles.occupiedTag}>
          {status === 1 ? '已发布' : '待审核'}
        </Tag>
      ),
    },
  ]

  // 场地列表列定义
  const courtColumns = [
    {
      title: '场地',
      dataIndex: 'courtName',
      key: 'courtName',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '13px' }}>{text}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: '11px' }}>{record.location}</Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'courtType',
      key: 'courtType',
      render: (type) => (
        <Tag style={type === '羽毛球' ? styles.badmintonTag : styles.sportTag}>
          {type}
        </Tag>
      ),
    },
  ]
}

/**
 * 样式对象 - 移动端优先设计
 */
const styles = {
  container: {
    padding: '0',
  },
  header: {
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    borderRadius: '16px',
    padding: '20px 16px',
    marginBottom: '16px',
    boxShadow: '0 6px 20px rgba(206, 136, 255, 0.3)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    fontSize: '20px',
    color: 'white',
  },
  title: {
    color: 'white',
    margin: 0,
    fontWeight: '700',
    fontSize: '18px',
  },
  tabButtons: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    padding: '0 4px',
    overflowX: 'auto',
  },
  tabBtn: {
    borderRadius: '16px',
    border: '1px solid #E2D5F5',
    color: '#8A80A0',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    height: '32px',
  },
  activeTab: {
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    color: 'white',
    fontWeight: '600',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    height: '32px',
  },
  tableCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.1)',
    border: '1px solid #E2D5F5',
  },
  avatarIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E8C6FF 0%, #F5EBFF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#CE88FF',
    fontSize: '14px',
  },
  adminTag: {
    background: 'linear-gradient(135deg, #F3EC46 0%, #FBF8B3 100%)',
    color: '#2A2438',
    border: 'none',
    fontWeight: '600',
    borderRadius: '12px',
    fontSize: '11px',
  },
  userTag: {
    background: '#E8F5E9',
    color: '#67E0A3',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  categoryTag: {
    background: '#F5EBFF',
    color: '#CE88FF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  badmintonTag: {
    background: '#F5EBFF',
    color: '#CE88FF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  sportTag: {
    background: '#E8F5E9',
    color: '#67E0A3',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  occupiedTag: {
    background: 'rgba(249, 100, 194, 0.15)',
    color: '#F964C2',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  freeTag: {
    background: 'rgba(103, 224, 163, 0.15)',
    color: '#67E0A3',
    border: 'none',
    borderRadius: '12px',
    fontSize: '11px',
  },
  switch: {
    '--antd-switch-bg': '#67E0A3',
  },
  noPermission: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  noPermissionIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  modalInput: {
    borderRadius: '10px',
    border: '1.5px solid #E2D5F5',
    height: '40px',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '16px',
  },
  cancelBtn: {
    borderRadius: '16px',
    border: '1px solid #E2D5F5',
    color: '#8A80A0',
    fontSize: '13px',
    height: '36px',
  },
  submitBtn: {
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    fontWeight: '600',
    fontSize: '13px',
    height: '36px',
  },
}

export default Admin
