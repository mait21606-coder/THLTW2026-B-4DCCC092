import { Table, Button, Modal, Form, DatePicker, Popconfirm, Space, Tag, InputNumber, Card, Row, Col, Statistic } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const getBMIDetails = (weight: number, height: number) => {
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return { val: bmi.toFixed(1), label: 'Thiểu cân', color: 'blue' };
  if (bmi < 25) return { val: bmi.toFixed(1), label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { val: bmi.toFixed(1), label: 'Thừa cân', color: 'gold' };
  return { val: bmi.toFixed(1), label: 'Béo phì', color: 'red' };
};

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setData(JSON.parse(localStorage.getItem('healthLogs') || '[]'));
  }, []);

  const save = (newData: any[]) => {
    setData(newData);
    localStorage.setItem('healthLogs', JSON.stringify(newData));
  };

  const avgStats = useMemo(() => {
    if (!data.length) return { bmi: '0', heart: 0, sleep: '0' };
    const sums = data.reduce((acc, cur) => ({
      bmi: acc.bmi + parseFloat(cur.bmi || 0),
      heart: acc.heart + (cur.heartRate || 0),
      sleep: acc.sleep + (cur.sleepHours || 0)
    }), { bmi: 0, heart: 0, sleep: 0 });

    return {
      bmi: (sums.bmi / data.length).toFixed(1),
      heart: Math.round(sums.heart / data.length),
      sleep: (sums.sleep / data.length).toFixed(1)
    };
  }, [data]);

  const onFinish = (values: any) => {
    const { val: bmiVal } = getBMIDetails(values.weight, values.height);
    const log = {
      ...values,
      bmi: bmiVal,
      date: values.date.format('YYYY-MM-DD'),
    };

    const newData = editingRecord
      ? data.map(i => i.key === editingRecord.key ? { ...i, ...log } : i)
      : [...data, { ...log, key: Date.now() }];

    save(newData);
    setOpen(false);
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', sorter: (a: any, b: any) => moment(a.date).diff(moment(b.date)) },
    { title: 'Cân nặng (kg)', dataIndex: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height' },
    { 
      title: 'BMI', 
      dataIndex: 'bmi',
      render: (bmi: string, record: any) => {
        const cat = getBMIDetails(record.weight, record.height);
        return <Space>{bmi} <Tag color={cat.color}>{cat.label}</Tag></Space>;
      }
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'heartRate' },
    { title: 'Ngủ (h)', dataIndex: 'sleepHours', render: (h: any) => h ? `${h}h` : '-' },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingRecord(record); form.setFieldsValue({ ...record, date: moment(record.date) }); setOpen(true); }} />
          <Popconfirm title="Xóa chỉ số này?" onConfirm={() => save(data.filter(i => i.key !== record.key))}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Dashboard Stats */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        {[
          { label: 'BMI TB', val: avgStats.bmi, color: '#1890ff' },
          { label: 'Nhịp tim TB', val: avgStats.heart, suffix: 'bpm' },
          { label: 'Giờ ngủ TB', val: avgStats.sleep, suffix: 'h' },
          { label: 'Số lần đo', val: data.length }
        ].map((s, i) => (
          <Col span={6} key={i}>
            <Card bordered={false} hoverable>
              <Statistic title={s.label} value={s.val} suffix={s.suffix} valueStyle={{ color: s.color }} />
            </Card>
          </Col>
        ))}
      </Row>

      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingRecord(null); form.resetFields(); setOpen(true); }} style={{ marginBottom: 16 }}>
        Thêm chỉ số
      </Button>

      <Table dataSource={data} columns={columns} rowKey="key" pagination={{ pageSize: 8 }} />

      <Modal
        title={editingRecord ? 'Sửa chỉ số' : 'Thêm chỉ số'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ date: moment() }}>
          <Form.Item name="date" label="Ngày đo" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}><Form.Item name="heartRate" label="Nhịp tim (bpm)"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item></Col>
            <Col span={12}><Form.Item name="sleepHours" label="Giờ ngủ (h)"><InputNumber min={0} max={24} style={{ width: '100%' }} /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};