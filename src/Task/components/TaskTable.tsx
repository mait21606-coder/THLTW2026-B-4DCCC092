import React, { useRef } from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input, InputRef } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import type { Task } from '../index';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

// 1. Tách cấu hình Mapping ra ngoài
const STATUS_MAP: Record<string, { text: string; color: string }> = {
  todo: { text: 'To Do', color: 'default' },
  'in-progress': { text: 'In Progress', color: 'processing' },
  done: { text: 'Done', color: 'success' },
};

const PRIORITY_COLORS: Record<string, string> = {
  High: 'red',
  Medium: 'orange',
  Low: 'blue',
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const searchInput = useRef<InputRef>(null);

  // 2. Helper tạo search props để làm gọn columns
  const getColumnSearchProps = (dataIndex: keyof Task) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button onClick={() => clearFilters && clearFilters()} size="small" style={{ width: 90 }}>
            Xóa
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  // 3. Định nghĩa Columns rõ ràng
  const columns: ColumnsType<Task> = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: '20%',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a, b) => moment(a.deadline).unix() - moment(b.deadline).unix(),
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={PRIORITY_COLORS[priority] || 'blue'}>{priority}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: Object.entries(STATUS_MAP).map(([value, { text }]) => ({ text, value })),
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        const config = STATUS_MAP[status] || { text: status, color: 'default' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
          />
          <Popconfirm 
            title="Xóa công việc này?" 
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={tasks} 
      rowKey="id" 
      pagination={{ pageSize: 5, showSizeChanger: false }}
      bordered
      size="middle"
    />
  );
};

export default TaskTable;