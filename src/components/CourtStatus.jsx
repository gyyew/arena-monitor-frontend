import { useState, useEffect } from 'react'
import { Card, Row, Col, Tag, Button, Typography, Space, Spin, Alert, Statistic } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { courtApi } from '../api/court'

const { Title, Text } = Typography

function CourtStatus() {
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchCourts = async () => {
    try {
      const result = await courtApi.getAllCourts()
      setCourts(result.data || [])
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch court status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourts()
    const interval = setInterval(fetchCourts, 30000)
    return () => clearInterval(interval)
  }, [])

  const freeCount = courts.filter(c => c.status === 'FREE').length
  const occupiedCount = courts.filter(c => c.status === 'OCCUPIED').length

  const getStatusColor = (status) => {
    return status === 'FREE' ? 'success' : 'error'
  }

  const getStatusIcon = (status) => {
    return status === 'FREE' 
      ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
      : <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
  }

  if (loading && !courts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading court status...</div>
      </div>
    )
  }

  if (error && !courts.length) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
        action={
          <Button onClick={fetchCourts}>Retry</Button>
        }
      />
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Court Status</Title>
          {lastUpdate && (
            <Text type="secondary">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </div>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={fetchCourts}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic 
              title="Available Courts" 
              value={freeCount} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic 
              title="Occupied Courts" 
              value={occupiedCount} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {courts.map(court => (
          <Col xs={24} sm={12} md={6} key={court.id}>
            <Card 
              hoverable
              title={
                <Space>
                  {getStatusIcon(court.status)}
                  Court #{court.courtNumber}
                </Space>
              }
            >
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Tag 
                  color={getStatusColor(court.status)} 
                  style={{ fontSize: '16px', padding: '8px 16px' }}
                >
                  {court.status === 'FREE' ? 'AVAILABLE' : 'OCCUPIED'}
                </Tag>
                {court.updateTime && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Updated: {new Date(court.updateTime).toLocaleString()}
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {error && (
        <Alert
          message="Update failed"
          description={error}
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
          closable
        />
      )}
    </div>
  )
}

export default CourtStatus