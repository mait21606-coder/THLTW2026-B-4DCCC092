import { Card, Row, Col, Statistic, Timeline, DatePicker } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';

const { RangePicker } = DatePicker;

export default () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [healthLogs, setHealthLogs] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);

  useEffect(() => {
    setWorkouts(JSON.parse(localStorage.getItem('workouts') || '[]'));
    setHealthLogs(JSON.parse(localStorage.getItem('healthLogs') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('goals') || '[]'));
  }, []);

  const { filteredWorkouts, stats, weeklyData, weightData } = useMemo(() => {
    const filtered = dateRange
      ? workouts.filter((w) => moment(w.date).isBetween(dateRange[0], dateRange[1], 'day', '[]'))
      : workouts;

    const currentMonthWorkouts = filtered.filter((w) => moment(w.date).month() === moment().month());
    
    const sortedDates = [...new Set(workouts.map((w) => w.date))].sort().reverse();
    let streak = 0, curr = moment();
    for (const d of sortedDates) {
      if (moment(d).isSame(curr, 'day')) { streak++; curr.subtract(1, 'day'); } else break;
    }

    return {
      filteredWorkouts: filtered,
      stats: {
        total: currentMonthWorkouts.length,
        calories: currentMonthWorkouts.reduce((a, b) => a + Number(b.calo || 0), 0),
        streak,
        goals: goals.length ? Math.round((goals.filter(g => g.status === 'Đã đạt').length / goals.length) * 100) : 0
      },
      weeklyData: Array.from({ length: 4 }).map((_, i) => {
        const start = moment().subtract((3 - i) * 7, 'days').startOf('week');
        const end = start.clone().endOf('week');
        return filtered.filter(w => moment(w.date).isBetween(start, end, 'day', '[]')).length;
      }),
      weightData: healthLogs
        .sort((a, b) => moment(a.date).diff(moment(b.date)))
        .slice(-10)
        .map(h => ({ date: moment(h.date).format('DD/MM'), weight: h.weight }))
    };
  }, [workouts, healthLogs, goals, dateRange]);

  return (
    <div style={{ padding: 16 }}>
      <RangePicker style={{ marginBottom: 16 }} onChange={(d) => setDateRange(d)} />

      <Row gutter={[16, 16]}>
        {[
          { label: 'Tổng buổi tập', val: stats.total, color: '#3f8600', unit: '' },
          { label: 'Tổng calo đốt', val: stats.calories, color: '#cf1322', unit: 'cal' },
          { label: 'Ngày tập liên tiếp', val: stats.streak, color: '#1890ff', unit: 'ngày' },
          { label: 'Mục tiêu', val: stats.goals, color: '#722ed1', unit: '%' },
        ].map((s, i) => (
          <Col span={6} key={i}>
            <Card><Statistic title={s.label} value={s.val} suffix={s.unit} valueStyle={{ color: s.color }} /></Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Buổi tập theo tuần">
            <ColumnChart xAxis={['T4', 'T3', 'T2', 'T1']} yAxis={[weeklyData]} yLabel={['Buổi']} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cân nặng">
            <LineChart xAxis={weightData.map(d => d.date)} yAxis={[weightData.map(d => d.weight)]} yLabel={['kg']} />
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi gần nhất" style={{ marginTop: 16 }}>
        <Timeline>
          {filteredWorkouts.slice(-5).reverse().map((w, i) => (
            <Timeline.Item key={i} color={w.status === 'Hoàn thành' ? 'green' : 'blue'}>
              <b>{w.type}</b> - {w.date} <br/>
              <small style={{ color: '#888' }}>{w.duration} phút | {w.calo} calo</small>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};