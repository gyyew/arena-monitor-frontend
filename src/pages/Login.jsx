import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const { Title } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setLoading(true)
    const result = await login(values.username, values.password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant="borderless">
        <div style={styles.header}>
          <Title level={2} style={styles.title}>Login</Title>
          <p style={styles.subtitle}>Welcome back! Please login to continue.</p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
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
              Login
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <span>Don't have an account? </span>
          <Link to="/register">Register now</Link>
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

export default Login