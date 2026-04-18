import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const { Title } = Typography

const Register = () => {
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setLoading(true)
    const result = await register(values.phone, values.password, values.nickname)
    setLoading(false)

    if (result.success) {
      message.success('注册成功！请登录。')
      navigate('/login')
    } else {
      message.error(result.error || '注册失败')
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant="borderless">
        <div style={styles.header}>
          <Title level={2} style={styles.title}>注册</Title>
          <p style={styles.subtitle}>创建账号开始使用。</p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="nickname"
            rules={[
              { required: true, message: '请输入昵称' },
              { min: 2, message: '昵称至少2个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="昵称"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('密码不匹配'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^\d{10,11}$/, message: '请输入有效的手机号' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={styles.button}
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <span>已有账号？ </span>
          <Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    marginBottom: '8px',
    color: '#333',
  },
  subtitle: {
    color: '#666',
    fontSize: '14px',
  },
  button: {
    height: '44px',
    fontSize: '16px',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: '16px',
    color: '#666',
  },
}

export default Register