import React from 'react';
import { Card, Row, Col, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DS_LOAI_PHONG, DS_NGUOI_PHU_TRACH } from '@/models/useModelPhongHoc';

const ThanhTimKiem = (props: any) => {
  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Tìm mã phòng, tên phòng..."
            prefix={<SearchOutlined />}
            allowClear
            value={props.timKiem}
            onChange={(e) => props.setTimKiem(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Lọc loại phòng"
            allowClear
            style={{ width: '100%' }}
            value={props.locLoaiPhong}
            onChange={(val) => props.setLocLoaiPhong(val)}
            options={DS_LOAI_PHONG}
          />
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Select
            placeholder="Lọc người phụ trách"
            allowClear
            style={{ width: '100%' }}
            value={props.locNguoiPT}
            onChange={(val) => props.setLocNguoiPT(val)}
            options={DS_NGUOI_PHU_TRACH.map((npt) => ({ value: npt, label: npt }))}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ThanhTimKiem;