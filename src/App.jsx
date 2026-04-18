import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, Avatar, Spin, Badge } from 'antd'
import { UserOutlined, LogoutOutlined, MenuOutlined, HomeOutlined, TeamOutlined, ProfileOutlined, SettingOutlined, MessageOutlined } from '@ant-design/icons'
import { useAuth } from './context/AuthContext'
import CourtStatus from './components/CourtStatus'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CourtHistory from './pages/CourtHistory'
import Posts from './pages/Posts'
import Messages from './pages/Messages'
import Admin from './pages/Admin'

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
    { key: 'courts', label: '场地监测', icon: <HomeOutlined /> },
    { key: 'posts', label: '球友社区', icon: <TeamOutlined /> },
    { key: 'profile', label: '个人中心', icon: <ProfileOutlined /> },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `登录用户: ${user?.nickname || '用户'}`,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: '私信',
      onClick: () => {
        window.location.href = '/messages'
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  // 管理员菜单
  if (user?.role === 1) {
    menuItems.push({
      key: 'admin',
      label: '管理员后台',
      icon: <SettingOutlined />,
    })
  }

  return (
    <Header style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px' }}>
      <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '40px' }}>
        🏸 场地监测与球友匹配平台
      </div>
      {isAuthenticated && (
        <>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[
              location.pathname === '/' ? 'courts' :
                location.pathname.startsWith('/posts') ? 'posts' :
                  location.pathname.startsWith('/profile') ? 'profile' :
                    location.pathname.startsWith('/admin') ? 'admin' : ''
            ]}
            items={menuItems}
            style={{ flex: 1 }}
            onClick={({ key }) => {
              switch (key) {
                case 'courts':
                  window.location.href = '/'
                  break
                case 'posts':
                  window.location.href = '/posts'
                  break
                case 'profile':
                  window.location.href = '/profile'
                  break
                case 'admin':
                  window.location.href = '/admin'
                  break
              }
            }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button type="text" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar size="small" icon={<UserOutlined />} />
              <span>{user?.nickname}</span>
              <Badge count={0} size="small" style={{ backgroundColor: '#52c41a' }} />
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
            <Layout style={{ minHeight: '100vh' }}>
              <AppHeader />
              <Content style={{ padding: '24px' }}>
                <CourtStatus />
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                场地监测与球友匹配平台 ©2024
              </Footer>
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <Profile />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  场地监测与球友匹配平台 ©2024
                </Footer>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <Posts />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  场地监测与球友匹配平台 ©2024
                </Footer>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <Messages />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  场地监测与球友匹配平台 ©2024
                </Footer>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <Admin />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  场地监测与球友匹配平台 ©2024
                </Footer>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/court-history"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <AppHeader />
                <Content style={{ padding: '24px' }}>
                  <CourtHistory />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                  场地监测与球友匹配平台 ©2024
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