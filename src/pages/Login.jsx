import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const { Title, Text } = Typography

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
      message.success('登录成功！欢迎回来~')
      navigate('/')
    } else {
      message.error(result.error || '登录失败，请检查账号密码')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundOrbs}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>
        <div style={styles.orb3}></div>
      </div>
      
      <Card style={styles.card} variant="borderless">
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={styles.logoEmoji}>🏸</span>
          </div>
          <Title level={2} style={styles.title}>欢迎回来</Title>
          <Text style={styles.subtitle}>登录后开始你的运动社交之旅</Text>
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
              prefix={<UserOutlined style={styles.inputIcon} />}
              placeholder="手机号"
              size="large"
              style={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={styles.inputIcon} />}
              placeholder="密码"
              size="large"
              style={styles.input}
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
              登 录
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <Text style={styles.footerText}>还没有账号？ </Text>
          <Link to="/register" style={styles.footerLink}>立即注册</Link>
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
    background: 'linear-gradient(135deg, #FCFAFF 0%, #F5EBFF 50%, #F1E8FF 100%)',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundOrbs: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(206, 136, 255, 0.2) 0%, transparent 70%)',
    top: '-100px',
    right: '-100px',
    animation: 'float 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(243, 236, 70, 0.15) 0%, transparent 70%)',
    bottom: '-50px',
    left: '-50px',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  orb3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(249, 100, 194, 0.12) 0%, transparent 70%)',
    top: '40%',
    left: '20%',
    animation: 'float 12s ease-in-out infinite',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(206, 136, 255, 0.25)',
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 24px rgba(206, 136, 255, 0.4)',
  },
  logoEmoji: {
    fontSize: '32px',
  },
  title: {
    marginBottom: '8px',
    color: '#2A2438',
    fontWeight: '700',
    fontSize: '28px',
  },
  subtitle: {
    color: '#8A80A0',
    fontSize: '15px',
  },
  input: {
    height: '52px',
    borderRadius: '14px',
    border: '1.5px solid #E2D5F5',
    background: '#FCFAFF',
    fontSize: '15px',
  },
  inputIcon: {
    color: '#B4A8CC',
    fontSize: '18px',
  },
  button: {
    height: '52px',
    fontSize: '17px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    borderRadius: '26px',
    boxShadow: '0 8px 20px rgba(206, 136, 255, 0.4)',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #E2D5F5',
  },
  footerText: {
    color: '#8A80A0',
    fontSize: '14px',
  },
  footerLink: {
    color: '#CE88FF',
    fontWeight: '600',
    fontSize: '14px',
    marginLeft: '4px',
  },
}

export default Login
