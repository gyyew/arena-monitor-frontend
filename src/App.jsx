/**
 * @file App.jsx
 * @description 应用主入口组件，包含路由配置、布局管理和移动端底部TabBar
 * @dependencies react-router-dom v6, antd, @ant-design/icons
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { ConfigProvider, Layout, Button, Avatar, Dropdown, Badge, App as AntApp } from 'antd'
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { AuthProvider, useAuth } from './context/AuthContext'
import CourtMonitor from './pages/CourtHistory'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostList from './pages/Posts'
import CreatePost from './pages/Posts'
import Messages from './pages/Messages'
import AdminDashboard from './pages/Admin'

/**
 * 路由保护组件 - 未登录用户重定向到登录页
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

/**
 * 管理员路由保护组件
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || user?.role !== 1) {
    return <Navigate to="/" replace />
  }
  return children
}

/**
 * 游客路由保护组件 - 已登录用户重定向到首页
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

/**
 * 应用头部组件
 * 显示品牌Logo、名称和用户菜单
 */
const AppHeader = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: `欢迎, ${user?.nickname || '小伙伴'}`,
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: '我的私信',
      onClick: () => navigate('/messages'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ]

  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <span style={styles.logo}>🏸</span>
        <span style={styles.brandName} className="hide-mobile">运动社交圈</span>
      </div>
      <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
        <Button style={styles.userBtn}>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={styles.avatar}
          />
          <span style={styles.userName}>{isAuthenticated ? (user?.nickname || '小伙伴') : '未登录'}</span>
          {isAuthenticated && <Badge count={0} size="small" style={styles.badge} />}
        </Button>
      </Dropdown>
    </header>
  )
}

/**
 * 微信小程序风格底部TabBar组件
 * 移动端固定底部导航，包含场地、社区、我的tab
 */
const BottomTabBar = () => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const getSelectedKey = () => {
    if (location.pathname === '/') return 'courts'
    if (location.pathname.startsWith('/posts')) return 'posts'
    if (location.pathname.startsWith('/profile')) return 'profile'
    if (location.pathname.startsWith('/admin')) return 'admin'
    return ''
  }

  const handleTabClick = (key) => {
    switch (key) {
      case 'courts':
        navigate('/')
        break
      case 'posts':
        navigate('/posts')
        break
      case 'profile':
        navigate('/profile')
        break
      case 'admin':
        navigate('/admin')
        break
    }
  }

  const selectedKey = getSelectedKey()

  const tabItems = [
    {
      key: 'courts',
      icon: <HomeOutlined style={{ fontSize: 22 }} />,
      label: '场地',
    },
    {
      key: 'posts',
      icon: <TeamOutlined style={{ fontSize: 22 }} />,
      label: '社区',
    },
    {
      key: 'profile',
      icon: <ProfileOutlined style={{ fontSize: 22 }} />,
      label: '我的',
    },
  ]

  // 管理员额外显示管理tab
  if (user?.role === 1) {
    tabItems.push({
      key: 'admin',
      icon: <SettingOutlined style={{ fontSize: 22 }} />,
      label: '管理',
    })
  }

  return (
    <div style={styles.tabBar}>
      {tabItems.map((item) => (
        <div
          key={item.key}
          style={{
            ...styles.tabItem,
            ...(selectedKey === item.key ? styles.tabItemActive : {}),
          }}
          onClick={() => handleTabClick(item.key)}
        >
          <div style={selectedKey === item.key ? styles.tabIconActive : styles.tabIcon}>
            {item.icon}
          </div>
          <span style={selectedKey === item.key ? styles.tabLabelActive : styles.tabLabel}>
            {item.label}
          </span>
        </div>
      ))}
      {/* 安全区域适配 */}
      <div style={styles.safeArea} />
    </div>
  )
}

/**
 * 主布局组件
 * 包含头部、内容区域和底部导航
 */
const MainLayout = () => (
  <Layout style={styles.layout}>
    <AppHeader />
    <div style={styles.contentWrapper}>
      <div style={styles.content}>
        <Outlet />
      </div>
    </div>
    <BottomTabBar />
  </Layout>
)

/**
 * 样式对象 - 移动端优先设计
 */
const styles = {
  // 头部样式
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    padding: '0 16px',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 16px rgba(206, 136, 255, 0.3)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logo: {
    fontSize: '24px',
  },
  brandName: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  userBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '24px',
    padding: '4px 12px 4px 4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    transition: 'all 0.3s ease',
    height: '36px',
  },
  avatar: {
    background: 'linear-gradient(135deg, #F3EC46 0%, #FBF8B3 100%)',
    color: '#2A2438',
    width: '28px !important',
    height: '28px !important',
    lineHeight: '28px !important',
  },
  userName: {
    fontWeight: '500',
    fontSize: '13px',
    maxWidth: '60px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  badge: {
    backgroundColor: '#67E0A3',
    boxShadow: '0 0 8px rgba(103, 224, 163, 0.5)',
  },

  // 内容区域样式
  contentWrapper: {
    flex: 1,
    paddingBottom: '70px', // 为底部TabBar留出空间
  },
  content: {
    padding: '16px',
    maxWidth: '480px', // 移动端最大宽度限制
    margin: '0 auto',
    width: '100%',
  },

  // 底部TabBar样式 - 微信小程序风格
  tabBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'white',
    boxShadow: '0 -4px 20px rgba(206, 136, 255, 0.12)',
    borderTop: '1px solid #E2D5F5',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1000,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  tabItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '50px',
  },
  tabItemActive: {
    background: 'transparent',
  },
  tabIcon: {
    color: '#8A80A0',
    fontSize: '22px',
    marginBottom: '2px',
  },
  tabIconActive: {
    color: '#CE88FF',
    fontSize: '22px',
    marginBottom: '2px',
  },
  tabLabel: {
    fontSize: '11px',
    color: '#8A80A0',
    fontWeight: '500',
  },
  tabLabelActive: {
    fontSize: '11px',
    color: '#CE88FF',
    fontWeight: '600',
  },
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'env(safe-area-inset-bottom, 0px)',
    background: 'white',
  },

  // 布局样式
  layout: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #FCFAFF 0%, #F5EBFF 100%)',
  },
}

/**
 * 应用根组件
 * 配置主题和路由
 */
function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#CE88FF',
          colorError: '#F964C2',
          colorWarning: '#38CEC4',
          colorSuccess: '#67E0A3',
          colorLink: '#B38DFF',
          borderRadiusLG: 18,
          borderRadius: 12,
          fontFamily: '"PingFang SC", "Microsoft Yahei", Roboto, sans-serif',
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 24,
            controlHeight: 44,
            paddingContentHorizontal: 20,
          },
          Card: {
            borderRadiusLG: 18,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 44,
          },
          Select: {
            borderRadius: 12,
          },
          Menu: {
            itemSelectedBg: '#F5EBFF',
            itemSelectedColor: '#CE88FF',
            itemHoverBg: '#F1E8FF',
            itemHoverColor: '#CE88FF',
          },
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<CourtMonitor />} />
                <Route path="posts" element={<PostList />} />
                <Route path="login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="posts/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
