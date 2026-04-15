import React from 'react';
import { Card, Table, Button, Space, Tag, Popconfirm, Typography, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { NHAN_LOAI_PHONG, MAU_LOAI_PHONG } from '@/models/useModelPhongHoc';

const { Text } = Typography;

const BangPhongHoc = (props: any) => {
  const xuLyXoa = (record: any) => {
    if (record.soChoNgoi >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ ngồi!');
      return;
    }
    props.onXoa(record.id);
  };

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      key: 'maPhong',
      width: 120,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      key: 'tenPhong',
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      key: 'soChoNgoi',
      width: 130,
      align: 'center' as const,
      sorter: (a: any, b: any) => a.soChoNgoi - b.soChoNgoi,
      render: (val: any) => <Text strong>{val}</Text>,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
      key: 'loaiPhong',
      width: 130,
      align: 'center' as const,
      render: (val: any) => (
        <Tag color={MAU_LOAI_PHONG[val]}>{NHAN_LOAI_PHONG[val]}</Tag>
      ),
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
      key: 'nguoiPhuTrach',
    },
    {
      title: 'Thao tác',
      key: 'thaoTac',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Sửa">
            <Button size="small" icon={<EditOutlined />} onClick={() => props.onSua(record)} />
          </Tooltip>

          {record.soChoNgoi >= 30 ? (
            <Tooltip title="Không thể xóa (từ 30 chỗ trở lên)">
              <Button size="small" danger icon={<DeleteOutlined />} disabled />
            </Tooltip>
          ) : (
            <Popconfirm
              title="Bạn có chắc muốn xóa phòng học này?"
              onConfirm={() => xuLyXoa(record)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Tooltip title="Xóa">
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Table
        bordered
        size="small"
        dataSource={props.danhSach}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5, showSizeChanger: true }}
      />
    </Card>
  );
};

export default BangPhongHoc;