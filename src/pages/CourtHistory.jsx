/**
 * @file CourtHistory.jsx
 * @description 场地监测历史页面组件，包含移动端优化的数据统计和筛选功能
 * @dependencies antd, @ant-design/icons
 */

import { useState, useEffect } from 'react'
import { Card, DatePicker, Select, Button, Table, Typography, message, Spin, Tag, Row, Col } from 'antd'
import { SearchOutlined, HomeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

/**
 * 场地监测历史页面组件
 * 移动端优化的场地数据查询和统计展示
 */
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
  const [courtTypes] = useState(['羽毛球', '篮球', '足球', '乒乓球'])

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      const response = await fetch('/api/v1/courts', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      })
      const result = await response.json()
      if (result.success) {
        const courtList = result.data.records || result.data
        setCourts(courtList)
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
      // 模拟API调用
      setTimeout(() => {
        setData([
          { monitorId: 1, courtName: '羽毛球场地A', location: '体育馆一楼', courtType: '羽毛球', status: 1, peopleCount: 4, monitorTime: '2024-01-15 10:00:00' },
          { monitorId: 2, courtName: '篮球场1号', location: '体育馆二楼', courtType: '篮球', status: 0, peopleCount: 0, monitorTime: '2024-01-15 10:00:00' },
        ])
        setLoading(false)
      }, 500)
    } catch (error) {
      message.error('获取历史数据失败，请稍后重试')
      console.error('Get court history error:', error)
      setLoading(false)
    }
  }

  const getCourtTypeColor = (type) => {
    const colors = {
      '羽毛球': '#CE88FF',
      '篮球': '#F3EC46',
      '足球': '#67E0A3',
      '乒乓球': '#38CEC4',
    }
    return colors[type] || '#CE88FF'
  }

  const totalRecords = data.length
  const occupiedCount = data.filter(item => item.status === 1).length
  const freeCount = data.filter(item => item.status === 0).length
  const occupancyRate = totalRecords > 0 ? ((occupiedCount / totalRecords) * 100).toFixed(1) : 0

  const columns = [
    {
      title: '场地',
      dataIndex: 'courtName',
      key: 'courtName',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          <Text type="secondary" style={{ display: 'block', fontSize: '11px' }}>{record.location}</Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'courtType',
      key: 'courtType',
      render: (type) => (
        <Tag style={{ ...styles.typeTag, background: getCourtTypeColor(type) + '20', color: getCourtTypeColor(type), fontSize: '11px', padding: '0 6px' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag style={status === 1 ? styles.occupiedTag : styles.freeTag}>
          {status === 1 ? <><CloseCircleOutlined /> 占用</> : <><CheckCircleOutlined /> 空闲</>}
        </Tag>
      ),
    },
    {
      title: '人数',
      dataIndex: 'peopleCount',
      key: 'peopleCount',
      render: (count) => (
        <Text strong>{count || 0}</Text>
      ),
    },
  ]

  return (
    <div style={styles.container}>
      {/* 页面头部 */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <HomeOutlined style={styles.headerEmoji} />
          </div>
          <div>
            <Title level={4} style={styles.title}>场地监测</Title>
            <Text style={styles.subtitle}>查看场地实时占用情况</Text>
          </div>
        </div>
      </div>

      {/* 筛选卡片 */}
      <Card style={styles.filterCard} styles={{ body: { padding: '16px' } }}>
        <div style={styles.filterRow}>
          <RangePicker
            style={styles.picker}
            onChange={(dates) => {
              if (dates) {
                setFilters(prev => ({
                  ...prev,
                  startTime: dates[0],
                  endTime: dates[1],
                }))
              }
            }}
            placeholder={['开始', '结束']}
            size="small"
          />
        </div>
        <div style={styles.filterRow}>
          <Select
            style={{ ...styles.select, flex: 1 }}
            placeholder="类型"
            value={filters.courtType}
            onChange={(value) => setFilters(prev => ({ ...prev, courtType: value }))}
            allowClear
            size="small"
          >
            {courtTypes.map(type => (
              <Select.Option key={type} value={type}>
                <Tag color={getCourtTypeColor(type)} style={{ margin: 0, fontSize: '11px' }}>{type}</Tag>
              </Select.Option>
            ))}
          </Select>
          <Select
            style={{ ...styles.selectWide, flex: 1 }}
            placeholder="场地"
            value={filters.courtId}
            onChange={(value) => setFilters(prev => ({ ...prev, courtId: value }))}
            allowClear
            size="small"
          >
            {courts.map(court => (
              <Select.Option key={court.courtId} value={court.courtId}>{court.courtName}</Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
            style={styles.searchBtn}
            size="small"
          >
            查询
          </Button>
        </div>

        {/* 统计卡片 - 移动端2x2布局 */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconBg}>
              <HomeOutlined style={styles.statIcon} />
            </div>
            <div>
              <Text style={styles.statLabel}>总记录</Text>
              <div style={styles.statValue}>{totalRecords}</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statOccupied }}>
            <div style={{ ...styles.statIconBg, background: 'rgba(249, 100, 194, 0.15)' }}>
              <CloseCircleOutlined style={{ ...styles.statIcon, color: '#F964C2', fontSize: '16px' }} />
            </div>
            <div>
              <Text style={styles.statLabel}>占用</Text>
              <div style={{ ...styles.statValue, color: '#F964C2', fontSize: '18px' }}>{occupiedCount}</div>
            </div>
          </div>
          <div style={{ ...styles.statCard, ...styles.statFree }}>
            <div style={{ ...styles.statIconBg, background: 'rgba(103, 224, 163, 0.15)' }}>
              <CheckCircleOutlined style={{ ...styles.statIcon, color: '#67E0A3', fontSize: '16px' }} />
            </div>
            <div>
              <Text style={styles.statLabel}>空闲</Text>
              <div style={{ ...styles.statValue, color: '#67E0A3', fontSize: '18px' }}>{freeCount}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIconBg, background: 'rgba(206, 136, 255, 0.15)' }}>
              <span style={{ ...styles.percentIcon, fontSize: '16px' }}>%</span>
            </div>
            <div>
              <Text style={styles.statLabel}>占用率</Text>
              <div style={{ ...styles.statValue, color: '#CE88FF', fontSize: '18px' }}>{occupancyRate}%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card style={styles.tableCard} styles={{ body: { padding: '12px' } }}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data.map(item => ({
              ...item,
              key: item.monitorId,
            }))}
            pagination={{
              pageSize: 5,
              size: 'small',
              showTotal: (total) => `${total}条`,
            }}
            size="small"
            locale={{ emptyText: '暂无数据，请选择筛选条件查询' }}
            scroll={{ x: 300 }}
          />
        </Spin>
      </Card>
    </div>
  )
}

/**
 * 样式对象 - 移动端优先设计
 */
const styles = {
  container: {
    padding: '0',
  },
  header: {
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    borderRadius: '16px',
    padding: '20px 16px',
    marginBottom: '16px',
    boxShadow: '0 6px 20px rgba(206, 136, 255, 0.3)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: '22px',
    color: 'white',
  },
  title: {
    color: 'white',
    marginBottom: '2px',
    fontWeight: '700',
    fontSize: '18px',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px',
  },
  filterCard: {
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.1)',
    border: '1px solid #E2D5F5',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  picker: {
    borderRadius: '10px',
    border: '1.5px solid #E2D5F5',
    width: '100%',
  },
  select: {
    borderRadius: '10px',
  },
  selectWide: {
    borderRadius: '10px',
  },
  searchBtn: {
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #CE88FF 0%, #B38DFF 100%)',
    border: 'none',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.35)',
    height: '32px',
    fontSize: '13px',
    padding: '0 12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '4px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: '#FCFAFF',
    borderRadius: '12px',
    border: '1px solid #E2D5F5',
  },
  statOccupied: {
    background: 'rgba(249, 100, 194, 0.05)',
  },
  statFree: {
    background: 'rgba(103, 224, 163, 0.05)',
  },
  statIconBg: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(206, 136, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: '16px',
    color: '#CE88FF',
  },
  percentIcon: {
    fontSize: '16px',
    color: '#CE88FF',
    fontWeight: '700',
  },
  statLabel: {
    display: 'block',
    color: '#8A80A0',
    fontSize: '11px',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2A2438',
  },
  tableCard: {
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(206, 136, 255, 0.1)',
    border: '1px solid #E2D5F5',
  },
  typeTag: {
    border: 'none',
    borderRadius: '10px',
    fontWeight: '500',
  },
  occupiedTag: {
    background: 'rgba(249, 100, 194, 0.15)',
    color: '#F964C2',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '500',
    fontSize: '11px',
    padding: '0 6px',
  },
  freeTag: {
    background: 'rgba(103, 224, 163, 0.15)',
    color: '#67E0A3',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '500',
    fontSize: '11px',
    padding: '0 6px',
  },
}

export default CourtHistory
