import { useState } from 'react'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const { Title, Text } = Typography

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
      message.success('注册成功！快去登录吧~')
      navigate('/login')
    } else {
      message.error(result.error || '注册失败，请稍后重试')
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
            <span style={styles.logoEmoji}>✨</span>
          </div>
          <Title level={2} style={styles.title}>加入我们</Title>
          <Text style={styles.subtitle}>创建一个账号，开启运动社交新体验</Text>
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
              prefix={<UserOutlined style={styles.inputIcon} />}
              placeholder="昵称"
              size="large"
              style={styles.input}
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
              prefix={<PhoneOutlined style={styles.inputIcon} />}
              placeholder="手机号"
              size="large"
              style={styles.input}
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
              prefix={<LockOutlined style={styles.inputIcon} />}
              placeholder="密码"
              size="large"
              style={styles.input}
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
                  return Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={styles.inputIcon} />}
              placeholder="确认密码"
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
              注 册
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.footer}>
          <Text style={styles.footerText}>已有账号？ </Text>
          <Link to="/login" style={styles.footerLink}>立即登录</Link>
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
    left: '-100px',
    animation: 'float 8s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(243, 236, 70, 0.15) 0%, transparent 70%)',
    bottom: '-50px',
    right: '-50px',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  orb3: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56, 206, 196, 0.12) 0%, transparent 70%)',
    top: '30%',
    right: '20%',
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
    marginBottom: '28px',
  },
  logo: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #F3EC46 0%, #FBF8B3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 24px rgba(243, 236, 70, 0.5)',
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

export default Register
