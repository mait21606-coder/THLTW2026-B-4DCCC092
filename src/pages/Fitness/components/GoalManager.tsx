import { Card, Button, Form, Input, Select, DatePicker, Popconfirm, Space, InputNumber, Progress, Row, Col, Segmented, Drawer, Tag } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import moment from 'moment';

const STATUS_MAP: any = {
  'Đã đạt': { color: '#52c41a', icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />, progressStatus: 'success' },
  'Đã hủy': { color: '#ff4d4f', icon: <StopOutlined style={{ color: '#ff4d4f' }} />, progressStatus: 'exception' },
  'Đang thực hiện': { color: '#1890ff', icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />, progressStatus: 'active' },
};

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('goals') || '[]'));
  }, []);

  const save = (newData: any[]) => {
    setData(newData);
    localStorage.setItem('goals', JSON.stringify(newData));
  };

  const filteredData = useMemo(() => 
    statusFilter === 'all' ? data : data.filter(i => i.status === statusFilter)
  , [statusFilter, data]);

  const calcGoal = (current: number, target: number, oldStatus: string) => {
    const progress = Math.min(100, Math.round((current / (target || 1)) * 100));
    return { progress, status: progress >= 100 ? 'Đã đạt' : oldStatus };
  };

  const handleUpdateValue = (key: number, newValue: number) => {
    const newData = data.map(item => {
      if (item.key !== key) return item;
      return { ...item, currentValue: newValue, ...calcGoal(newValue, item.targetValue, item.status) };
    });
    save(newData);
  };

  const onFinish = (values: any) => {
    const goalData = {
      ...values,
      deadline: values.deadline?.format('YYYY-MM-DD'),
      ...calcGoal(values.currentValue || 0, values.targetValue, values.status),
    };

    const newData = editingRecord
      ? data.map(i => i.key === editingRecord.key ? { ...i, ...goalData } : i)
      : [...data, { ...goalData, key: Date.now() }];

    save(newData);
    setOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Segmented
          value={statusFilter}
          onChange={val => setStatusFilter(val as string)}
          options={[{ label: 'Tất cả', value: 'all' }, ...Object.keys(STATUS_MAP).map(k => ({ label: k, value: k }))]}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingRecord(null); form.resetFields(); setOpen(true); }}>
          Mục tiêu mới
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {filteredData.map((goal) => (
          <Col key={goal.key} xs={24} sm={12} lg={8}>
            <Card
              actions={[
                <EditOutlined onClick={() => { setEditingRecord(goal); form.setFieldsValue({ ...goal, deadline: goal.deadline ? moment(goal.deadline) : null }); setOpen(true); }} />,
                <Popconfirm title="Xóa mục tiêu này?" onConfirm={() => save(data.filter(i => i.key !== goal.key))}>
                  <DeleteOutlined style={{ color: '#ff4d4f' }} />
                </Popconfirm>
              ]}
            >
              <Card.Meta
                avatar={STATUS_MAP[goal.status]?.icon}
                title={goal.name}
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Tag color="blue">{goal.type}</Tag>
                    <div><b>{goal.currentValue}</b> / {goal.targetValue} {goal.unit}</div>
                    <InputNumber 
                      size="small" 
                      min={0} 
                      value={goal.currentValue} 
                      onChange={v => handleUpdateValue(goal.key, v || 0)} 
                    />
                    <Progress 
                      percent={goal.progress} 
                      status={STATUS_MAP[goal.status]?.progressStatus} 
                      strokeColor={STATUS_MAP[goal.status]?.color} 
                    />
                    {goal.deadline && <small style={{ color: '#888' }}>Hạn: {goal.deadline}</small>}
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={editingRecord ? 'Cập nhật mục tiêu' : 'Mục tiêu mới'}
        open={open}
        onClose={() => setOpen(false)}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()}>Xác nhận</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: 'Đang thực hiện', currentValue: 0, type: 'Giảm cân' }}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại">
            <Select options={['Giảm cân', 'Tăng cơ', 'Cải thiện sức bền', 'Khác'].map(v => ({ value: v, label: v }))} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={14}><Form.Item name="targetValue" label="Mục tiêu" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={10}><Form.Item name="unit" label="Đơn vị"><Input placeholder="kg, calo..." /></Form.Item></Col>
          </Row>
          <Form.Item name="currentValue" label="Hiện tại"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="deadline" label="Ngày hết hạn"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select options={Object.keys(STATUS_MAP).map(k => ({ value: k, label: k }))} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};