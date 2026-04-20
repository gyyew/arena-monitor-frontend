import { useState, useEffect } from 'react'
import { Card, List, Avatar, Input, Button, Typography, message, Spin, Badge, Empty } from 'antd'
import { UserOutlined, SendOutlined, MessageOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { getMessages, sendMessage } from '../api/post'

const { Title, Text } = Typography
const { TextArea } = Input

const Messages = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [conversation, setConversation] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchMessages()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        // 过滤掉当前用户 - 后端返回的是IPage对象，需要取records
        const userList = result.data.records || result.data
        const filteredUsers = userList.filter(u => u.userId !== user.userId)
        setUsers(filteredUsers)
      }
    } catch (error) {
      console.error('Fetch users error:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const result = await getMessages()
      if (result.success) {
        setMessages(result.data)
      } else {
        message.error(result.message || '获取消息失败')
      }
    } catch (error) {
      message.error('获取消息失败，请稍后重试')
      console.error('Fetch messages error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectUser = async (user) => {
    setSelectedUser(user)
    // 这里应该获取与该用户的对话历史
    // 暂时模拟数据
    setConversation([
      {
        messageId: 1,
        fromUserId: user.userId,
        fromUserNickname: user.nickname,
        content: '你好，一起打球吗？',
        sendTime: new Date().toLocaleString(),
      },
      {
        messageId: 2,
        fromUserId: user.userId,
        fromUserNickname: user.nickname,
        content: '最近有时间吗？',
        sendTime: new Date().toLocaleString(),
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) {
      message.warning('请选择用户并输入消息内容')
      return
    }

    try {
      const result = await sendMessage(
        selectedUser.userId,
        messageText
      )
      if (result.success) {
        // 添加到对话列表
        setConversation(prev => [...prev, {
          messageId: Date.now(),
          fromUserId: user.userId,
          fromUserNickname: user.nickname,
          content: messageText,
          sendTime: new Date().toLocaleString(),
        }])
        setMessageText('')
        message.success('消息发送成功')
      } else {
        message.error(result.message || '消息发送失败')
      }
    } catch (error) {
      message.error('消息发送失败，请稍后重试')
      console.error('Send message error:', error)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>私信</Title>

      <div style={{ display: 'flex', gap: '24px', height: '600px' }}>
        {/* 用户列表 */}
        <Card style={{ width: '300px' }}>
          <Title level={4}>球友列表</Title>
          <List
            loading={loading}
            dataSource={users}
            renderItem={user => (
              <List.Item
                key={user.userId}
                onClick={() => handleSelectUser(user)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedUser?.userId === user.userId ? '#f0f0f0' : 'transparent',
                  padding: '12px',
                  borderRadius: '8px'
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={user.nickname}
                  description={user.sportPreference || '未设置运动偏好'}
                />
              </List.Item>
            )}
            locale={{ emptyText: '暂无球友' }}
          />
        </Card>

        {/* 对话区域 */}
        <Card style={{ flex: 1 }}>
          {selectedUser ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <Avatar icon={<UserOutlined />} />
                <div style={{ marginLeft: '12px' }}>
                  <Text strong>{selectedUser.nickname}</Text>
                  <Text type="secondary" style={{ marginLeft: '8px' }}>
                    {selectedUser.sportPreference || '未设置运动偏好'}
                  </Text>
                </div>
              </div>

              <div style={{ height: '350px', overflowY: 'auto', marginBottom: '24px' }}>
                <List
                  dataSource={conversation}
                  renderItem={msg => (
                    <List.Item style={{ padding: '8px 0' }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: msg.fromUserId === user.userId ? 'flex-end' : 'flex-start'
                      }}>
                        <div style={{
                          maxWidth: '70%',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: msg.fromUserId === user.userId ? '#e6f7ff' : '#f0f0f0'
                        }}>
                          <div style={{ marginBottom: '4px' }}>
                            <Text strong>{msg.fromUserNickname}</Text>
                          </div>
                          <Text>{msg.content}</Text>
                          <div style={{ marginTop: '4px', textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {msg.sendTime}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <TextArea
                  rows={3}
                  placeholder="输入消息..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{ alignSelf: 'flex-end' }}
                >
                  发送
                </Button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <Text type="secondary" style={{ marginTop: '16px' }}>请选择一个球友开始对话</Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Messages