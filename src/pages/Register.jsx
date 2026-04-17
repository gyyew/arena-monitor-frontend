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
    const result = await register(values.username, values.password, values.phone)
    setLoading(false)

    if (result.success) {
      navigate('/login')
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant="borderless">
        <div style={styles.header}>
          <Title level={2} style={styles.title}>Register</Title>
          <p style={styles.subtitle}>Create your account to get started.</p>
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
            name="username"
            rules={[
              { required: true, message: 'Please enter a username' },
              { min: 3, message: 'Username must be at least 3 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Passwords do not match'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\d{10,11}$/, message: 'Please enter a valid phone number' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
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
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <span>Already have an account? </span>
          <Link to="/login">Login now</Link>
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