import { useState, useEffect } from 'react'
import { Card, Row, Col, Tag, Button, Typography, Space, Spin, Alert, Statistic, Select, Table } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { courtApi } from '../api/court'

const { Title, Text } = Typography
const { Option } = Select

function CourtStatus() {
  const [courts, setCourts] = useState([])
  const [monitorData, setMonitorData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [selectedType, setSelectedType] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const fetchCourts = async () => {
    try {
      setLoading(true)
      const result = await courtApi.getAllCourts()
      if (result.success) {
        setCourts(result.data || [])
        setLastUpdate(new Date())
        setError(null)
        
        // Fetch latest monitor data for each court
        const monitorDataMap = {}
        for (const court of result.data) {
          const monitorResponse = await courtApi.getLatestMonitorData(court.courtId)
          if (monitorResponse.success) {
            monitorDataMap[court.courtId] = monitorResponse.data
          }
        }
        setMonitorData(monitorDataMap)
      }
    } catch (err) {
      setError(err.message || '获取场地状态失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourts()
    const interval = setInterval(fetchCourts, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredCourts = selectedType 
    ? courts.filter(court => court.courtType === selectedType)
    : courts

  const freeCount = Object.values(monitorData).filter(data => data.occupyStatus === 0).length
  const occupiedCount = Object.values(monitorData).filter(data => data.occupyStatus === 1).length

  const columns = [
    {
      title: '场地名称',
      dataIndex: 'courtName',
      key: 'courtName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '场地类型',
      dataIndex: 'courtType',
      key: 'courtType',
      render: (text) => (
        <Tag color={text === '羽毛球' ? 'blue' : 'green'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '占用状态',
      dataIndex: 'courtId',
      key: 'status',
      render: (courtId) => {
        const data = monitorData[courtId]
        if (!data) return <Text>-</Text>
        return (
          <Tag color={data.occupyStatus === 0 ? 'success' : 'danger'}>
            {data.occupyStatus === 0 ? '空闲' : '占用'}
          </Tag>
        )
      },
    },
    {
      title: '当前人数',
      dataIndex: 'courtId',
      key: 'peopleCount',
      render: (courtId) => {
        const data = monitorData[courtId]
        return data ? data.peopleCount : '-'  
      },
    },
    {
      title: '最新采集时间',
      dataIndex: 'courtId',
      key: 'identifyTime',
      render: (courtId) => {
        const data = monitorData[courtId]
        return data ? data.identifyTime : '-'  
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="default" 
          icon={<HistoryOutlined />}
          onClick={() => navigate('/court-history')}
        >
          查看历史
        </Button>
      ),
    },
  ]

  if (loading && !courts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载场地状态中...</div>
      </div>
    )
  }

  if (error && !courts.length) {
    return (
      <Alert
        message="错误"
        description={error}
        type="error"
        showIcon
        action={
          <Button onClick={fetchCourts}>重试</Button>
        }
      />
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>场地监测</Title>
          {lastUpdate && (
            <Text type="secondary">
              最后更新: {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Select
            placeholder="按场地类型筛选"
            style={{ width: 160 }}
            value={selectedType}
            onChange={setSelectedType}
          >
            <Option value="">全部</Option>
            <Option value="羽毛球">羽毛球</Option>
            <Option value="篮球">篮球</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={fetchCourts}
            loading={loading}
          >
            刷新
          </Button>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card>
            <Statistic 
              title="空闲场地" 
              value={freeCount} 
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic 
              title="占用场地" 
              value={occupiedCount} 
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Table 
          dataSource={filteredCourts} 
          columns={columns} 
          rowKey="courtId"
          pagination={false}
          scroll={{ x: 1000 }}
        />
      </Card>

      {!isAuthenticated && (
        <Card style={{ marginTop: '24px' }}>
          <Text type="info">
            登录后可查看更多详细的场地信息和历史数据。
          </Text>
        </Card>
      )}

      {error && (
        <Alert
          message="更新失败"
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