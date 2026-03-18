import React, { useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, Tag, Space, message, Rate, Card, Row, Col, Statistic, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

// --- KIỂU DỮ LIỆU ---
type Status = 'Chờ duyệt' | 'Xác nhận' | 'Hoàn thành' | 'Hủy';
interface Employee { id: string; name: string; maxPerDay: number; workingDay: string; hours: string; }
interface Service { id: string; name: string; price: number; duration: number; }
interface Appointment { id: string; customerName: string; empId: string; svcId: string; date: string; time: string; status: Status; }
interface Review { id: string; appId: string; rating: number; comment: string; reply?: string; }

export default function EnhancedBookingApp() {
  const [employees, setEmps] = useState<Employee[]>([
    { id: 'E1', name: 'GuGu', maxPerDay: 5, workingDay: 'Thứ 6', hours: '09:00-17:00' },
    { id: 'E2', name: 'GaGa', maxPerDay: 3, workingDay: 'Thứ 2-6', hours: '08:00-18:00' }
  ]);
  const [services, setSvcs] = useState<Service[]>([
    { id: 'S1', name: 'Cắt tóc', price: 100000, duration: 30 },
    { id: 'S2', name: 'Gội đầu', price: 50000, duration: 45 }
  ]);
  const [appointments, setApps] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [form] = Form.useForm();
  const [modalType, setModalType] = useState<'EMP'|'SVC'|'APP'|'REV'|'REPLY'|null>(null);
  const [editId, setEditId] = useState<string|null>(null);

  // --- LOGIC HỖ TRỢ ---
  const getAvgRate = (empId: string) => {
    const empAppIds = appointments.filter(a => a.empId === empId).map(a => a.id);
    const empReviews = reviews.filter(r => empAppIds.includes(r.appId));
    if (empReviews.length === 0) return 0;
    return Number((empReviews.reduce((sum, r) => sum + r.rating, 0) / empReviews.length).toFixed(1));
  };

  const handleFinish = (values: any) => {
    const id = editId || `ID_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    if (modalType === 'APP') {
      const dateStr = values.date.format('YYYY-MM-DD');
      const timeStr = values.time.format('HH:mm');
      const svc = services.find(s => s.id === values.svcId);
      const newStart = dayjs(`${dateStr} ${timeStr}`);
      const newEnd = newStart.add(svc?.duration || 30, 'minute');

      // 1. Kiểm tra giới hạn khách/ngày
      const dailyApps = appointments.filter(a => a.empId === values.empId && a.date === dateStr && a.status !== 'Hủy');
      const emp = employees.find(e => e.id === values.empId);
      if (emp && dailyApps.length >= emp.maxPerDay) return message.error('Nhân viên đã đạt giới hạn khách trong ngày!');

      // 2. Kiểm tra trùng lịch (Overlap logic)
      const isOverlap = dailyApps.some(a => {
        const aStart = dayjs(`${a.date} ${a.time}`);
        const aSvc = services.find(s => s.id === a.svcId);
        const aEnd = aStart.add(aSvc?.duration || 30, 'minute');
        return newStart.isBefore(aEnd) && newEnd.isAfter(aStart);
      });
      if (isOverlap) return message.error('Khung giờ này đã có khách đặt (trùng thời gian thực hiện)!');

      setApps([...appointments, { id, ...values, date: dateStr, time: timeStr, status: 'Chờ duyệt' }]);
      message.success('Đặt lịch thành công!');
    } else if (modalType === 'EMP') {
        if (editId) setEmps(employees.map(e => e.id === id ? { ...e, ...values } : e));
        else setEmps([...employees, { id, ...values }]);
    } else if (modalType === 'SVC') {
        if (editId) setSvcs(services.map(s => s.id === id ? { ...s, ...values } : s));
        else setSvcs([...services, { id, ...values }]);
    } else if (modalType === 'REV') {
        setReviews([...reviews, { id, ...values }]);
    } else if (modalType === 'REPLY') {
        setReviews(reviews.map(r => r.id === editId ? { ...r, reply: values.reply } : r));
    }
    setModalType(null);
  };

  return (
    <Card title="Hệ Thống Quản Lý Lịch Hẹn Chuyên Nghiệp" style={{ margin: 20, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <Tabs defaultActiveKey="1" type="card">
        {/* TAB 1: NHÂN VIÊN & DỊCH VỤ */}
        <Tabs.TabPane tab="Nhân viên & Dịch vụ" key="1">
          <Row gutter={[16, 16]}>
            <Col span={14}>
              <Card title="Danh sách Nhân viên" size="small" extra={<Button type="primary" size="small" onClick={() => setModalType('EMP')}>+ Thêm</Button>}>
                <Table size="small" dataSource={employees} rowKey="id" pagination={{pageSize: 5}} columns={[
                  { title: 'Tên', dataIndex: 'name', fontWeight: 'bold' },
                  { title: 'Đánh giá', render: (_, r) => <Space><Rate disabled allowHalf defaultValue={getAvgRate(r.id)} style={{fontSize: 12}} /> <span>{getAvgRate(r.id)}</span></Space> },
                  { title: 'Khách/Ngày', dataIndex: 'maxPerDay' },
                  { title: 'Thao tác', render: (_, r) => <Popconfirm title="Xóa nhân viên này?" onConfirm={() => setEmps(employees.filter(e=>e.id!==r.id))}><a style={{color:'red'}}>Xóa</a></Popconfirm> }
                ]} />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Dịch vụ" size="small" extra={<Button type="primary" size="small" onClick={() => setModalType('SVC')}>+ Thêm</Button>}>
                <Table size="small" dataSource={services} rowKey="id" pagination={{pageSize: 5}} columns={[
                  { title: 'Tên', dataIndex: 'name' },
                  { title: 'Giá', dataIndex: 'price', render: v => `${v.toLocaleString()}đ` },
                  { title: 'Phút', dataIndex: 'duration' },
                  { title: '', render: (_, r) => <a onClick={() => setSvcs(services.filter(s=>s.id!==r.id))}>Xóa</a> }
                ]} />
              </Card>
            </Col>
          </Row>
        </Tabs.TabPane>

        {/* TAB 2: LỊCH HẸN */}
        <Tabs.TabPane tab="Quản lý Lịch hẹn" key="2">
          <Button type="primary" icon="+" onClick={() => setModalType('APP')} style={{ marginBottom: 16 }}>Đặt Lịch Mới</Button>
          <Table dataSource={appointments} rowKey="id" columns={[
            { title: 'Khách hàng', dataIndex: 'customerName' },
            { title: 'Dịch vụ', render: (_, r) => services.find(s=>s.id===r.svcId)?.name },
            { title: 'Thời gian', render: (_, r) => `${r.date} ${r.time}` },
            { title: 'Trạng thái', dataIndex: 'status', render: st => (
              <Tag color={st==='Hoàn thành'?'green':st==='Hủy'?'red':st==='Xác nhận'?'orange':'blue'}>{st}</Tag>
            )},
            { title: 'Hành động', render: (_, r) => (
              <Space>
                {r.status === 'Chờ duyệt' && <Button size="small" type="link" onClick={() => setApps(appointments.map(a=>a.id===r.id?{...a, status:'Xác nhận'}:a))}>Xác nhận</Button>}
                {r.status === 'Xác nhận' && <Button size="small" type="link" onClick={() => setApps(appointments.map(a=>a.id===r.id?{...a, status:'Hoàn thành'}:a))}>Hoàn thành</Button>}
                {['Chờ duyệt', 'Xác nhận'].includes(r.status) && <Button size="small" type="link" danger onClick={() => setApps(appointments.map(a=>a.id===r.id?{...a, status:'Hủy'}:a))}>Hủy</Button>}
              </Space>
            )}
          ]} />
        </Tabs.TabPane>

        {/* TAB 3: ĐÁNH GIÁ */}
        <Tabs.TabPane tab="Đánh giá & Phản hồi" key="3">
          <Button type="primary" ghost onClick={() => setModalType('REV')} style={{ marginBottom: 16 }}>Viết Đánh giá</Button>
          <Table dataSource={reviews} rowKey="id" columns={[
            { title: 'Lịch', dataIndex: 'appId' },
            { title: 'Đánh giá', dataIndex: 'rating', render: v => <Rate disabled defaultValue={v} /> },
            { title: 'Nội dung', dataIndex: 'comment' },
            { title: 'Phản hồi từ NV', dataIndex: 'reply', render: (v, r) => v ? <Tag color="processing">{v}</Tag> : <Button size="small" onClick={() => {setEditId(r.id); setModalType('REPLY')}}>Trả lời</Button> }
          ]} />
        </Tabs.TabPane>

        {/* TAB 4: THỐNG KÊ */}
        <Tabs.TabPane tab="Thống kê" key="4">
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={8}><Card><Statistic title="Tổng Cuộc Hẹn" value={appointments.length} /></Card></Col>
            <Col span={8}><Card><Statistic title="Doanh Thu Dự Kiến" value={appointments.filter(a=>a.status!=='Hủy').reduce((s, a) => s + (services.find(sv=>sv.id===a.svcId)?.price || 0), 0)} suffix="đ" valueStyle={{color: '#cf1322'}} /></Card></Col>
            <Col span={8}><Card><Statistic title="Hoàn thành" value={appointments.filter(a=>a.status==='Hoàn thành').length} valueStyle={{color: '#3f8600'}} /></Card></Col>
          </Row>
          <Card title="Doanh thu chi tiết theo Dịch vụ" size="small">
             <Table size="small" pagination={false} dataSource={services.map(s => ({
                name: s.name,
                count: appointments.filter(a => a.svcId === s.id && a.status === 'Hoàn thành').length,
                revenue: appointments.filter(a => a.svcId === s.id && a.status === 'Hoàn thành').length * s.price
             }))} columns={[
                { title: 'Tên Dịch vụ', dataIndex: 'name' },
                { title: 'Số lượt', dataIndex: 'count' },
                { title: 'Tổng tiền', dataIndex: 'revenue', render: v => <b>{v.toLocaleString()}đ</b> }
             ]} />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      {/* MODAL CHUNG */}
      <Modal open={!!modalType} title="Cập nhật thông tin" onOk={() => form.submit()} onCancel={() => setModalType(null)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {modalType === 'EMP' && <>
            <Form.Item name="name" label="Tên Nhân viên" rules={[{required: true}]}><Input /></Form.Item>
            <Form.Item name="maxPerDay" label="Giới hạn khách/ngày" initialValue={5}><InputNumber min={1} /></Form.Item>
          </>}
          {modalType === 'APP' && <>
            <Form.Item name="customerName" label="Tên Khách hàng" rules={[{required: true}]}><Input /></Form.Item>
            <Form.Item name="empId" label="Nhân viên" rules={[{required: true}]}>
              <Select>{employees.map(e => <Select.Option key={e.id} value={e.id}>{e.name} (Lượt khách tối đa: {e.maxPerDay})</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="svcId" label="Dịch vụ" rules={[{required: true}]}>
              <Select>{services.map(s => <Select.Option key={s.id} value={s.id}>{s.name} ({s.duration}p - {s.price.toLocaleString()}đ)</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="date" label="Ngày đặt" rules={[{required: true}]}><DatePicker style={{width:'100%'}} disabledDate={d => d && d < dayjs().startOf('day')} /></Form.Item>
            <Form.Item name="time" label="Giờ đặt" rules={[{required: true}]}><DatePicker picker="time" format="HH:mm" style={{width:'100%'}} /></Form.Item>
          </>}
          {modalType === 'REV' && <>
            <Form.Item name="appId" label="Chọn Lịch Hẹn" rules={[{required: true}]}>
              <Select>{appointments.filter(a=>a.status==='Hoàn thành').map(a => <Select.Option key={a.id} value={a.id}>{a.customerName} - {a.date}</Select.Option>)}</Select>
            </Form.Item>
            <Form.Item name="rating" label="Số sao" initialValue={5}><Rate /></Form.Item>
            <Form.Item name="comment" label="Nhận xét"><Input.TextArea /></Form.Item>
          </>}
          {modalType === 'REPLY' && <Form.Item name="reply" label="Nội dung phản hồi"><Input.TextArea autoFocus /></Form.Item>}
        </Form>
      </Modal>
    </Card>
  );
}   