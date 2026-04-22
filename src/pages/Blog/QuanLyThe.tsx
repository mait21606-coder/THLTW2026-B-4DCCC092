import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Popconfirm, message, Tag as AntTag, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined, BarChartOutlined } from '@ant-design/icons';
import { getTags, saveTags, getArticles, Tag } from './data';

const { Text } = Typography;

const QuanLyThe: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();

  const loadData = () => {
    setTags(getTags());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getUsageCount = (tagId: string) => {
    const articles = getArticles();
    return articles.filter(a => a.tags.includes(tagId)).length;
  };

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Tag) => {
    setEditingTag(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    const usage = getUsageCount(id);
    if (usage > 0) {
      message.error(`Thẻ này đang gắn với ${usage} bài viết, không thể xóa!`);
      return;
    }
    const newTags = tags.filter(t => t.id !== id);
    saveTags(newTags);
    setTags(newTags);
    message.success('Đã xóa thẻ thành công');
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      let newTags = [...tags];
      if (editingTag) {
        newTags = newTags.map(t => t.id === editingTag.id ? { ...t, name: values.name } : t);
      } else {
        newTags.push({
          id: Date.now().toString(),
          name: values.name,
        });
      }
      saveTags(newTags);
      setTags(newTags);
      setIsModalVisible(false);
      message.success(`${editingTag ? 'Cập nhật' : 'Thêm'} thẻ thành công`);
    });
  };

  const columns = [
    {
      title: 'Thông tin thẻ',
      key: 'name',
      render: (record: Tag) => (
        <Space>
          <TagOutlined style={{ color: '#1890ff' }} />
          <AntTag color="blue" style={{ fontSize: '14px', padding: '2px 8px' }}>
            {record.name}
          </AntTag>
        </Space>
      ),
    },
    {
      title: 'Tần suất sử dụng',
      key: 'usage',
      align: 'center' as const,
      render: (record: Tag) => {
        const count = getUsageCount(record.id);
        return (
          <Space>
            <BarChartOutlined style={{ color: count > 0 ? '#52c41a' : '#bfbfbf' }} />
            <Text strong={count > 0} type={count === 0 ? 'secondary' : undefined}>
              {count} bài viết
            </Text>
          </Space>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Tag) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xóa thẻ này sẽ không thể hoàn tác. Bạn chắc chứ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card 
        bordered={false}
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        title={
          <Space>
            <TagOutlined />
            <span>Phân loại Thẻ</span>
          </Space>
        }
        extra={
          <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={handleAdd}>
            Tạo thẻ mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={tags} 
          rowKey="id" 
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          locale={{ emptyText: 'Chưa có thẻ nào được tạo' }}
        />
      </Card>

      <Modal
        title={editingTag ? 'Chỉnh sửa tên thẻ' : 'Tạo thẻ phân loại mới'}
        open={isModalVisible} // Dùng open thay cho visible (AntD v5)
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Để sau"
        centered
        width={400}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '10px' }}>
          <Form.Item
            name="name"
            label="Tên hiển thị của thẻ"
            rules={[
              { required: true, message: 'Tên thẻ không được để trống!' },
              { max: 20, message: 'Tên thẻ không nên quá 20 ký tự' }
            ]}
          >
            <Input prefix={<TagOutlined />} placeholder="Ví dụ: Sữa hạt, Sức khỏe..." allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyThe;