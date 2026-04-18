import { useState, useEffect } from 'react'
import { Card, DatePicker, Select, Button, Table, Typography, message, Spin, Statistic, Row, Col } from 'antd'
import { SearchOutlined, AreaChartOutlined } from '@ant-design/icons'
import { getCourtHistory } from '../api/court'

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const CourtHistory = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({
    startTime: null,
    endTime: null,
    courtType: '',
    courtId: '',
  })
  const [courts, setCourts] = useState([])
  const [courtTypes, setCourtTypes] = useState(['羽毛球', '篮球', '足球', '乒乓球'])

  // 初始化获取场地列表
  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/court/list')
      const result = await response.json()
      if (result.success) {
        setCourts(result.data)
      }
    } catch (error) {
      console.error('Fetch courts error:', error)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = {
        startTime: filters.startTime ? filters.startTime.format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: filters.endTime ? filters.endTime.format('YYYY-MM-DD HH:mm:ss') : '',
        courtType: filters.courtType,
        courtId: filters.courtId,
      }
      const result = await getCourtHistory(params)
      if (result.success) {
        setData(result.data)
      } else {
        message.error(result.message || '获取历史数据失败')
      }
    } catch (error) {
      message.error('获取历史数据失败，请稍后重试')
      console.error('Get court history error:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: '场地名称',
      dataIndex: 'courtName',
      key: 'courtName',
    },
    {
      title: '场地类型',
      dataIndex: 'courtType',
      key: 'courtType',
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '占用状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? '#f5222d' : '#52c41a' }}>
          {status === 1 ? '占用' : '空闲'}
        </span>
      ),
    },
    {
      title: '人数',
      dataIndex: 'peopleCount',
      key: 'peopleCount',
    },
    {
      title: '记录时间',
      dataIndex: 'monitorTime',
      key: 'monitorTime',
      render: (time) => new Date(time).toLocaleString(),
    },
  ]

  // 统计数据
  const totalRecords = data.length
  const occupiedCount = data.filter(item => item.status === 1).length
  const freeCount = data.filter(item => item.status === 0).length
  const occupancyRate = totalRecords > 0 ? ((occupiedCount / totalRecords) * 100).toFixed(2) : 0

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>场地历史数据</Title>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <RangePicker
            style={{ width: 300 }}
            onChange={(dates) => {
              if (dates) {
                setFilters(prev => ({
                  ...prev,
                  startTime: dates[0],
                  endTime: dates[1],
                }))
              }
            }}
            placeholder={['开始时间', '结束时间']}
          />
          <Select
            style={{ width: 150 }}
            placeholder="场地类型"
            value={filters.courtType}
            onChange={(value) => setFilters(prev => ({ ...prev, courtType: value }))}
          >
            <Option value="">全部</Option>
            {courtTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="选择场地"
            value={filters.courtId}
            onChange={(value) => setFilters(prev => ({ ...prev, courtId: value }))}
          >
            <Option value="">全部场地</Option>
            {courts.map(court => (
              <Option key={court.courtId} value={court.courtId}>{court.courtName}</Option>
            ))}
          </Select>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            onClick={handleSearch}
            loading={loading}
          >
            查询
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={6}>
            <Statistic title="总记录数" value={totalRecords} />
          </Col>
          <Col span={6}>
            <Statistic title="占用次数" value={occupiedCount} prefix={<span style={{ color: '#f5222d' }}>●</span>} />
          </Col>
          <Col span={6}>
            <Statistic title="空闲次数" value={freeCount} prefix={<span style={{ color: '#52c41a' }}>●</span>} />
          </Col>
          <Col span={6}>
            <Statistic title="占用率" value={occupancyRate} suffix="%" />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data.map(item => ({
            ...item,
            key: item.monitorId,
          }))}
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default CourtHistory