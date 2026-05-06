import { Card, Input, Button, Modal, Form, Select, Row, Col, Tag, Space, Popconfirm, InputNumber, Divider } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const DIFFICULTIES = [
  { label: 'Dễ', value: 'Dễ', color: 'green' },
  { label: 'Trung bình', value: 'Trung bình', color: 'orange' },
  { label: 'Khó', value: 'Khó', color: 'red' },
];

const DEFAULT_EXERCISES = [
  { key: 1, name: 'Push-up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Bài tập cơ ngực cơ bản', caloriesPerHour: 300 },
  { key: 2, name: 'Squat', muscleGroup: 'Legs', difficulty: 'Dễ', description: 'Bài tập chân cơ bản', caloriesPerHour: 250 },
  { key: 6, name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Bài tập toàn thân kết hợp cardio', caloriesPerHour: 500 },
];

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [modalState, setModalState] = useState<{ open: boolean; type: 'edit' | 'detail'; record: any | null }>({
    open: false,
    type: 'edit',
    record: null,
  });
  const [filters, setFilters] = useState({ search: '', muscle: null, level: null });
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('exercises') || '[]');
    const initialData = saved.length ? saved : DEFAULT_EXERCISES;
    setData(initialData);
    if (!saved.length) localStorage.setItem('exercises', JSON.stringify(DEFAULT_EXERCISES));
  }, []);

  const saveToLocal = (newData: any[]) => {
    setData(newData);
    localStorage.setItem('exercises', JSON.stringify(newData));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchMuscle = !filters.muscle || item.muscleGroup === filters.muscle;
      const matchLevel = !filters.level || item.difficulty === filters.level;
      return matchSearch && matchMuscle && matchLevel;
    });
  }, [data, filters]);

  const handleOpenModal = (type: 'edit' | 'detail', record: any = null) => {
    setModalState({ open: true, type, record });
    if (type === 'edit') {
      form.setFieldsValue(record || { difficulty: 'Dễ', caloriesPerHour: 200 });
    }
  };

  const onFinish = (values: any) => {
    const isEdit = !!modalState.record;
    const newData = isEdit 
      ? data.map(i => i.key === modalState.record.key ? { ...i, ...values } : i)
      : [...data, { ...values, key: Date.now() }];
    
    saveToLocal(newData);
    setModalState({ open: false, type: 'edit', record: null });
    form.resetFields();
  };

  const handleDelete = (e: any, key: number) => {
    e.stopPropagation();
    saveToLocal(data.filter(i => i.key !== key));
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Header & Filters */}
      <Row gutter={[8, 8]} align="middle" style={{ marginBottom: 20 }}>
        <Col flex="auto">
          <Space wrap>
            <Input
              placeholder="Tìm tên bài tập..."
              prefix={<SearchOutlined />}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              style={{ width: 220 }}
            />
            <Select
              placeholder="Nhóm cơ"
              allowClear
              options={MUSCLE_GROUPS.map(g => ({ label: g, value: g }))}
              onChange={val => setFilters(prev => ({ ...prev, muscle: val }))}
              style={{ width: 130 }}
            />
            <Select
              placeholder="Mức độ"
              allowClear
              options={DIFFICULTIES}
              onChange={val => setFilters(prev => ({ ...prev, level: val }))}
              style={{ width: 130 }}
            />
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal('edit')}>
            Thêm mới
          </Button>
        </Col>
      </Row>

      {/* Grid Danh sách */}
      <Row gutter={[16, 16]}>
        {filteredData.map(item => (
          <Col key={item.key} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              actions={[
                <EyeOutlined key="view" onClick={() => handleOpenModal('detail', item)} />,
                <EditOutlined key="edit" onClick={() => handleOpenModal('edit', item)} />,
                <Popconfirm title="Xóa bài tập?" onConfirm={(e) => handleDelete(e, item.key)}>
                  <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} />
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={<Space>{item.name} <Tag color={DIFFICULTIES.find(d => d.value === item.difficulty)?.color}>{item.difficulty}</Tag></Space>}
                description={
                  <div style={{ fontSize: '13px' }}>
                    <p style={{ margin: '4px 0' }}>💪 Cơ: <b>{item.muscleGroup}</b></p>
                    <p style={{ margin: '4px 0' }}>🔥 Calo: <b>{item.caloriesPerHour} kcal/h</b></p>
                    <p style={{ color: '#999', marginTop: 8 }} className="truncate-2-lines">{item.description}</p>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal chi tiết / Form */}
      <Modal
        title={modalState.type === 'detail' ? `Chi tiết: ${modalState.record?.name}` : (modalState.record ? 'Cập nhật' : 'Thêm mới')}
        open={modalState.open}
        onCancel={() => setModalState({ ...modalState, open: false })}
        footer={modalState.type === 'detail' ? [ <Button key="ok" onClick={() => setModalState({ ...modalState, open: false })}>Đóng</Button> ] : null}
      >
        {modalState.type === 'detail' ? (
          <div>
            <Space split={<Divider type="vertical" />}>
              <span>Nhóm cơ: <b>{modalState.record?.muscleGroup}</b></span>
              <span>Đốt cháy: <b>{modalState.record?.caloriesPerHour} kcal/h</b></span>
            </Space>
            <p style={{ marginTop: 15 }}>{modalState.record?.description}</p>
            <Divider orientation="left">Hướng dẫn</Divider>
            <ul style={{ color: '#666' }}>
              <li>Thực hiện đúng kỹ thuật để tránh chấn thương.</li>
              <li>Hít thở đều đặn theo nhịp động tác.</li>
              <li>Nghỉ giữa các hiệp từ 30-60 giây.</li>
            </ul>
          </div>
        ) : (
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
              <Input placeholder="Ví dụ: Bench Press" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true }]}>
                  <Select options={MUSCLE_GROUPS.map(g => ({ label: g, value: g }))} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true }]}>
                  <Select options={DIFFICULTIES} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="caloriesPerHour" label="Calo/Giờ">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setModalState({ ...modalState, open: false })} style={{ marginRight: 8 }}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu lại</Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};