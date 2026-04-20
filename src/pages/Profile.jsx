/**
 * @file Profile.jsx
 * @description 个人中心页面组件，包含移动端优化的用户信息编辑和密码修改
 * @dependencies antd, @ant-design/icons
 */

import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, Tabs, Upload, Avatar, Tag, message } from 'antd'
import { UserOutlined, LockOutlined, UploadOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

/**
 * 个人中心页面组件
 * 移动端优化的用户资料管理和密码修改
 */
const Profile = () => {
  const { user, updateUserInfo, changePassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [infoForm] = Form.useForm()
  const [passwordForm] = Form.useForm()

  useEffect(() => {
    if (user) {
      infoForm.setFieldsValue({
        nickname: user.nickname,
        phone: user.phone,
        sportPreference: user.sportPreference || '',
        intro: user.intro || '',
      })
    }
  }, [user, infoForm])

  const handleUpdateInfo = async (values) => {
    try {
      setLoading(true)
      const result = await updateUserInfo(
        values.nickname,
        values.avatar,
        values.sportPreference,
        values.intro
      )
      if (result.success) {
        message.success('个人信息更新成功~')
      } else {
        message.error(result.message || '更新失败')
      }
    } catch (error) {
      message.error('更新失败，请稍后重试')
      console.error('Update info error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (values) => {
    try {
      setLoading(true)
      const result = await changePassword(values.oldPassword, values.newPassword)
      if (result.success) {
        message.success('密码修改成功~')
        passwordForm.resetFields()
      } else {
        message.error(result.message || '密码修改失败')
      }
    } catch (error) {
      message.error('密码修改失败，请稍后重试')
      console.error('Change password error:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadProps = {
    name: 'file',
    action: 'https://api.example.com/upload',
    headers: {
      authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <div style={styles.container}>
      {/* 用户信息头部卡片 */}
      <div style={styles.headerCard}>
        <div style={styles.headerGradient}></div>
        <div style={styles.avatarWrapper}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            style={styles.avatar}
          />
        </div>
        <div style={styles.userInfo}>
          <Title level={3} style={styles.nickname}>{user?.nickname}</Title>
          <div style={styles.tags}>
            <Tag style={styles.roleTag}>{user?.role === 1 ? '👑 管理员' : '🏸 运动达人'}</Tag>
            {user?.sportPreference && (
              <Tag style={styles.sportTag}>{user.sportPreference}</Tag>
            )}
          </div>
          <Text style={styles.phone}>{user?.phone}</Text>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={styles.content}>
        <Card style={styles.card}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            size="small"
          >
            <TabPane
              tab={<span><UserOutlined />资料</span>}
              key="info"
            >
              <div style={styles.formContainer}>
                <Form
                  form={infoForm}
                  layout="vertical"
                  onFinish={handleUpdateInfo}
                >
                  <Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true, message: '请输入昵称' }]}
                  >
                    <Input
                      prefix={<UserOutlined style={styles.inputIcon} />}
                      placeholder="你的昵称"
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="手机号"
                  >
                    <Input
                      prefix={<UserOutlined style={styles.inputIcon} />}
                      disabled
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="sportPreference"
                    label="运动偏好"
                  >
                    <Input
                      placeholder="例如：羽毛球,篮球"
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="intro"
                    label="个人简介"
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="介绍一下自己吧~"
                      style={styles.textArea}
                    />
                  </Form.Item>

                  <Form.Item
                    name="avatar"
                    label="头像"
                  >
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />} style={styles.uploadBtn}>
                        上传头像
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={styles.submitBtn}
                      block
                    >
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>

            <TabPane
              tab={<span><LockOutlined />密码</span>}
              key="password"
            >
              <div style={styles.formContainer}>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="oldPassword"
                    label="原密码"
                    rules={[{ required: true, message: '请输入原密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={styles.inputIcon} />}
                      placeholder="输入原密码"
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="新密码"
                    rules={[
                      { required: true, message: '请输入新密码' },
                      { min: 6, message: '密码至少6个字符' },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={styles.inputIcon} />}
                      placeholder="输入新密码"
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="确认新密码"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: '请确认新密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('两次密码不一致'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={styles.inputIcon} />}
                      placeholder="再次输入新密码"
                      size="large"
                      style={styles.input}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      style={styles.submitBtn}
                      block
                    >
                      修改密码
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

/**
 * 样式对象 - 移动端优先设计
 */
const styles = {
  container: {
    padding: '12px',
  },
  headerCard: {
    position: 'relative',
    background: 'white',
    borderRadius: '20px',
    padding: '32px 16px 20px',
    marginBottom: '16px',
    boxShadow: '0 6px 20px rgba(206, 136, 255, 0.15)',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #E8C6FF 50%, #F5EBFF 100%)',
  },
  avatarWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
    zIndex: 1,
  },
  avatar: {
    border: '4px solid white',
    boxShadow: '0 6px 20px rgba(206, 136, 255, 0.3)',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
  },
  userInfo: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  nickname: {
    marginBottom: '6px',
    color: '#2A2438',
    fontWeight: '700',
    fontSize: '20px',
  },
  tags: {
    display: 'flex',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: '6px',
    flexWrap: 'wrap',
  },
  roleTag: {
    background: 'linear-gradient(135deg, #F3EC46 0%, #FBF8B3 100%)',
    color: '#2A2438',
    border: 'none',
    fontWeight: '600',
    borderRadius: '16px',
    fontSize: '12px',
  },
  sportTag: {
    background: '#F5EBFF',
    color: '#CE88FF',
    border: 'none',
    fontWeight: '500',
    borderRadius: '16px',
    fontSize: '12px',
  },
  phone: {
    color: '#8A80A0',
    fontSize: '13px',
  },
  content: {
    marginTop: '0',
  },
  card: {
    borderRadius: '18px',
    boxShadow: '0 4px 16px rgba(206, 136, 255, 0.1)',
    border: '1px solid #E2D5F5',
  },
  formContainer: {
    paddingTop: '12px',
  },
  input: {
    height: '44px',
    borderRadius: '12px',
    border: '1.5px solid #E2D5F5',
    background: '#FCFAFF',
    fontSize: '14px',
  },
  inputIcon: {
    color: '#B4A8CC',
    fontSize: '14px',
  },
  textArea: {
    borderRadius: '12px',
    border: '1.5px solid #E2D5F5',
    background: '#FCFAFF',
    fontSize: '14px',
  },
  uploadBtn: {
    borderRadius: '12px',
    border: '1.5px dashed #E2D5F5',
    color: '#8A80A0',
    height: '44px',
  },
  submitBtn: {
    height: '44px',
    borderRadius: '22px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    fontWeight: '600',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.4)',
    marginTop: '8px',
  },
}

export default Profile
