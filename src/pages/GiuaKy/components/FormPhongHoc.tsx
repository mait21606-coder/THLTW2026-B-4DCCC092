import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { DS_LOAI_PHONG, DS_NGUOI_PHU_TRACH } from '@/models/useModelPhongHoc';

const FormPhongHoc = (props: any) => {
  return (
    <Modal
      title={props.dangSua ? 'Sửa phòng học' : 'Thêm phòng học'}
      visible={props.visible}
      onOk={() => props.form.submit()}
      onCancel={props.onDong}
      okText={props.dangSua ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={props.form} layout="vertical" onFinish={props.onLuu}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maPhong"
              label="Mã phòng"
              rules={[
                { required: true, message: 'Nhập mã phòng!' },
                { max: 10, message: 'Tối đa 10 ký tự!' },
              ]}
            >
              <Input placeholder="VD: A101" maxLength={10} showCount />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="tenPhong"
              label="Tên phòng"
              rules={[
                { required: true, message: 'Nhập tên phòng!' },
                { max: 50, message: 'Tối đa 50 ký tự!' },
              ]}
            >
              <Input placeholder="VD: Phòng học lý thuyết 1" maxLength={50} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nguoiPhuTrach"
              label="Người phụ trách"
              rules={[{ required: true, message: 'Chọn người phụ trách!' }]}
            >
              <Select
                placeholder="Chọn"
                options={DS_NGUOI_PHU_TRACH.map((npt) => ({ value: npt, label: npt }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="soChoNgoi"
              label="Số chỗ ngồi"
              rules={[{ required: true, message: 'Nhập số chỗ ngồi!' }]}
            >
              <InputNumber min={10} max={200} style={{ width: '100%' }} placeholder="10 - 200" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="loaiPhong"
          label="Loại phòng"
          rules={[{ required: true, message: 'Chọn loại phòng!' }]}
        >
          <Select placeholder="Chọn loại phòng" options={DS_LOAI_PHONG} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormPhongHoc;