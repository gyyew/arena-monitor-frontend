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
    const result = await login(values.phone, values.password)
    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      message.error(result.error || 'Login failed')
    }
  }

  return (
    <div style={styles.container}>
      <Card style={styles.card} variant="borderless">
        <div style={styles.header}>
          <Title level={2} style={styles.title}>登录</Title>
          <p style={styles.subtitle}>欢迎回来！请登录继续。</p>
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
            name="phone"
            rules={[{ required: true, message: '请输入手机号' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
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
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <span>还没有账号？ </span>
          <Link to="/register">立即注册</Link>
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