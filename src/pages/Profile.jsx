import { useState, useEffect } from 'react'
import { Card, Form, Input, Button, Typography, message, Spin, Divider, Tabs, Upload, Avatar } from 'antd'
import { UserOutlined, LockOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography
const { TabPane } = Tabs

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
        message.success('个人信息更新成功')
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
        message.success('密码修改成功')
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
        // 这里应该更新avatar字段
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>个人中心</Title>
      
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Avatar size={128} icon={<UserOutlined />} style={{ border: '2px solid #d9d9d9' }} />
          <div>
            <Title level={4}>{user?.nickname}</Title>
            <Text type="secondary">{user?.phone}</Text>
            <div style={{ marginTop: '8px' }}>
              <Text>{user?.sportPreference ? `运动偏好: ${user.sportPreference}` : '未设置运动偏好'}</Text>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Text>{user?.role === 1 ? '管理员' : '普通用户'}</Text>
            </div>
          </div>
        </div>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="个人信息" key="info">
          <Card>
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
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                name="phone"
                label="手机号"
              >
                <Input prefix={<UserOutlined />} disabled />
              </Form.Item>

              <Form.Item
                name="sportPreference"
                label="运动偏好"
              >
                <Input placeholder="例如：羽毛球,篮球" />
              </Form.Item>

              <Form.Item
                name="intro"
                label="个人简介"
              >
                <Input.TextArea rows={4} placeholder="介绍一下自己吧" />
              </Form.Item>

              <Form.Item
                name="avatar"
                label="头像"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>上传头像</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab="修改密码" key="password">
          <Card>
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
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('密码不匹配'))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  修改密码
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Profile