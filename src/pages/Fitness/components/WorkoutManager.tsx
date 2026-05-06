import { Table, Button, Modal, Form, Input, Select, DatePicker, Popconfirm, Space, InputNumber, Tag } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const WORKOUT_TYPES = ['Cardio', 'Yoga', 'HIIT', 'Gym', 'Other'].map(t => ({ label: t, value: t }));
const STATUS_OPTIONS = [
  { label: 'Hoàn thành', value: 'Hoàn thành', color: 'green' },
  { label: 'Bỏ lỡ', value: 'Bỏ lỡ', color: 'red' },
];

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    searchText: '',
    type: null as string | null,
    dateRange: null as [moment.Moment, moment.Moment] | null,
  });

  const [form] = Form.useForm();

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('workouts') || '[]'));
  }, []);

  const save = (newData: any[]) => {
    setData(newData);
    localStorage.setItem('workouts', JSON.stringify(newData));
  };

  const filteredData = useMemo(() => {
    const { searchText, type, dateRange } = filters;
    return data.filter((item: any) => {
      const matchSearch = !searchText || 
        item.type?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchType = !type || item.type === type;
      
      const matchDate = !dateRange || 
        moment(item.date).isBetween(dateRange[0], dateRange[1], 'day', '[]');

      return matchSearch && matchType && matchDate;
    });
  }, [data, filters]);

  const handleOpenModal = (record: any = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue({ ...record, date: moment(record.date) });
    } else {
      form.resetFields();
    }
    setOpen(true);
  };

  const onFinish = (values: any) => {
    const workoutData = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    const newData = editingRecord
      ? data.map((i) => (i.key === editingRecord.key ? { ...i, ...workoutData } : i))
      : [...data, { ...workoutData, key: Date.now() }];

    save(newData);
    setOpen(false);
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', sorter: (a: any, b: any) => moment(a.date).diff(moment(b.date)) },
    { 
      title: 'Loại bài tập', 
      dataIndex: 'type', 
      filters: WORKOUT_TYPES.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value: any, record: any) => record.type === value 
    },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', sorter: (a: any, b: any) => a.duration - b.duration },
    { title: 'Calo', dataIndex: 'calo', sorter: (a: any, b: any) => a.calo - b.calo },
    { title: 'Ghi chú', dataIndex: 'note', ellipsis: true },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        const config = STATUS_OPTIONS.find(s => s.value === status);
        return <Tag color={config?.color || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
          <Popconfirm title="Xóa buổi tập này?" onConfirm={() => save(data.filter(i => i.key !== record.key))}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Search & Filters Section */}
      <Space wrap style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Space wrap>
          <Input
            placeholder="Tìm bài tập hoặc ghi chú..."
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 250 }}
            onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
          />
          <Select
            placeholder="Loại bài tập"
            allowClear
            style={{ width: 150 }}
            options={WORKOUT_TYPES}
            onChange={(val) => setFilters(prev => ({ ...prev, type: val }))}
          />
          <RangePicker
            onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates as any }))}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
          Thêm buổi tập
        </Button>
      </Space>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        bordered
      />

      <Modal
        title={editingRecord ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: 'Hoàn thành' }}
        >
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
            <Select options={WORKOUT_TYPES} placeholder="Chọn loại bài tập" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duration" label="Thời lượng (phút)">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="calo" label="Calo">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="status" label="Trạng thái">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};