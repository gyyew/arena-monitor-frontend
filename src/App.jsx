import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, Avatar, Spin } from 'antd'
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons'
import { useAuth } from './context/AuthContext'
import CourtStatus from './components/CourtStatus'
import Login from './pages/Login'
import Register from './pages/Register'

const { Header, Content, Footer } = Layout

// Protected Route component - redirects unauthenticated users to login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Public Route component - redirects authenticated users to home
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

// Header component with user menu
const AppHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const menuItems = [
    { key: 'courts', label: 'Court Status' },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `Logged in as ${user?.username || 'User'}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ]

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '40px' }}>
        🏸 Court Monitor
      </div>
      {isAuthenticated && (
        <>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname === '/' ? 'courts' : '']}
            items={menuItems}
            style={{ flex: 1 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{user?.username}</span>
            </Button>
          </Dropdown>
        </>
      )}
    </Header>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - login and register */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <CourtStatus />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  Badminton Court Monitor ©2024
                </Footer>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App