import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Popconfirm, message, Select, Tag as AntTag, Row, Col, Avatar, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileTextOutlined, pictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getArticles, saveArticles, getTags, Article, Tag } from './data';

const { Option } = Select;
const { TextArea } = Input;

const QuanLyBaiViet: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [form] = Form.useForm();

  const loadData = () => {
    setArticles(getArticles());
    setTags(getTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Hàm tạo slug tự động
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    form.setFieldsValue({ slug });
  };

  const handleAdd = () => {
    setEditingArticle(null);
    form.resetFields();
    form.setFieldsValue({ status: 'Draft', coverImage: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=2070' });
    setIsModalVisible(true);
  };

  const handleEdit = (record: Article) => {
    setEditingArticle(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const newArticles = articles.filter(a => a.id !== id);
    saveArticles(newArticles);
    setArticles(newArticles);
    message.success('Đã xóa bài viết');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      let newArticles = [...articles];
      if (editingArticle) {
        newArticles = newArticles.map(a => a.id === editingArticle.id ? { ...a, ...values } : a);
      } else {
        newArticles.unshift({
          id: Date.now().toString(),
          ...values,
          viewCount: 0,
          createdAt: new Date().toISOString(),
        });
      }
      saveArticles(newArticles);
      setArticles(newArticles);
      setIsModalVisible(false);
      message.success('Lưu bài viết thành công');
    });
  };

  const columns = [
    {
      title: 'Bài viết',
      key: 'article',
      render: (_: any, record: Article) => (
        <Space>
          <Avatar 
            shape="square" 
            size={48} 
            src={record.coverImage} 
            icon={<pictureOutlined />}
          />
          <div style={{ marginLeft: 8 }}>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{record.title}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.slug}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phân loại',
      key: 'tags',
      render: (record: Article) => (
        <Space wrap>
          {record.tags?.map(tagId => {
            const tag = tags.find(t => t.id === tagId);
            return tag ? <AntTag color="cyan" key={tagId}>{tag.name}</AntTag> : null;
          })}
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => (
        <AntTag color={status === 'Published' ? '#87d068' : '#f50'}>
          {status === 'Published' ? 'Công khai' : 'Nháp'}
        </AntTag>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      render: (date: string) => (
        <span style={{ fontSize: '13px', color: '#595959' }}>
          {moment(date).format('DD/MM/YYYY')}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Article) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa bài này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', padding: '24px', minHeight: '100vh' }}>
      <Card 
        title={<span style={{ fontSize: 20 }}>📑 Danh sách bài viết</span>}
        extra={<Button type="primary" shape="round" icon={<PlusOutlined />} onClick={handleAdd}>Tạo bài mới</Button>}
        bordered={false}
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={16}>
            <Input 
              placeholder="Tìm theo tiêu đề bài viết..." 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Select defaultValue="All" style={{ width: '100%' }} onChange={setFilterStatus}>
              <Option value="All">Tất cả trạng thái</Option>
              <Option value="Published">Đã xuất bản</Option>
              <Option value="Draft">Bản nháp</Option>
            </Select>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={articles.filter(a => a.title.toLowerCase().includes(searchText.toLowerCase()) && (filterStatus === 'All' || a.status === filterStatus))}
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={editingArticle ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={900}
        centered
      >
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Thông tin cơ bản" key="1">
              <Row gutter={16}>
                <Col span={16}>
                  <Form.Item name="title" label="Tiêu đề bài viết" rules={[{ required: true }]}>
                    <Input placeholder="Ví dụ: Cách làm sữa hạt tại nhà" onChange={handleTitleChange} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="status" label="Trạng thái">
                    <Select>
                      <Option value="Draft">Lưu nháp</Option>
                      <Option value="Published">Xuất bản ngay</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="slug" label="Đường dẫn (Slug)">
                <Input placeholder="duong-dan-bai-viet" />
              </Form.Item>
              <Form.Item name="coverImage" label="Link ảnh đại diện">
                <Input placeholder="Dán link ảnh tại đây..." />
              </Form.Item>
              <Form.Item name="tags" label="Gắn thẻ">
                <Select mode="multiple" placeholder="Chọn thẻ phù hợp">
                  {tags.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            
            <Tabs.TabPane tab="Nội dung chi tiết" key="2">
              <Form.Item name="summary" label="Tóm tắt ngắn">
                <TextArea rows={3} placeholder="Mô tả ngắn gọn nội dung bài viết..." />
              </Form.Item>
              <Form.Item name="content" label="Nội dung bài viết (Markdown)" rules={[{ required: true }]}>
                <TextArea rows={12} style={{ fontFamily: 'SFMono-Regular, Consolas, monospace' }} placeholder="Viết nội dung tại đây..." />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyBaiViet;