import React, { useState } from 'react';
import { Button, Typography, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
// @ts-ignore
import ThanhTimKiem from './components/ThanhTimKiem';
// @ts-ignore
import BangPhongHoc from './components/BangPhongHoc';
// @ts-ignore
import FormPhongHoc from './components/FormPhongHoc';

const { Title } = Typography;

const GiuaKy = () => {
  const { danhSach, themPhongHoc, suaPhongHoc, xoaPhongHoc } = useModel('useModelPhongHoc' as any);

  const [hienModal, setHienModal] = useState(false);
  const [dangSua, setDangSua] = useState(null as any);
  const [timKiem, setTimKiem] = useState('');
  const [locLoaiPhong, setLocLoaiPhong] = useState(undefined as any);
  const [locNguoiPT, setLocNguoiPT] = useState(undefined as any);
  const [form] = Form.useForm();

  const moFormThem = () => {
    setDangSua(null);
    form.resetFields();
    setHienModal(true);
  };

  const moFormSua = (record: any) => {
    setDangSua(record);
    form.setFieldsValue({
      maPhong: record.maPhong,
      tenPhong: record.tenPhong,
      soChoNgoi: record.soChoNgoi,
      loaiPhong: record.loaiPhong,
      nguoiPhuTrach: record.nguoiPhuTrach,
    });
    setHienModal(true);
  };

  const xuLyLuu = (values: any) => {
    let ok = false;
    if (dangSua) {
      ok = suaPhongHoc(dangSua.id, values);
    } else {
      ok = themPhongHoc(values);
    }
    if (ok) {
      setHienModal(false);
      form.resetFields();
    }
  };

  const dongModal = () => {
    setHienModal(false);
    form.resetFields();
  };

  let dsHienThi = [] as any[];
  for (let i = 0; i < danhSach.length; i++) {
    let hienThi = true;

    if (timKiem !== '') {
      const tk = timKiem.toLowerCase();
      if (!danhSach[i].maPhong.toLowerCase().includes(tk) && !danhSach[i].tenPhong.toLowerCase().includes(tk)) {
        hienThi = false;
      }
    }

    if (locLoaiPhong && danhSach[i].loaiPhong !== locLoaiPhong) {
      hienThi = false;
    }

    if (locNguoiPT && danhSach[i].nguoiPhuTrach !== locNguoiPT) {
      hienThi = false;
    }

    if (hienThi) {
      dsHienThi.push(danhSach[i]);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 24 }}>
        🏫 QUẢN LÝ PHÒNG HỌC
      </Title>

      <ThanhTimKiem
        timKiem={timKiem}
        setTimKiem={setTimKiem}
        locLoaiPhong={locLoaiPhong}
        setLocLoaiPhong={setLocLoaiPhong}
        locNguoiPT={locNguoiPT}
        setLocNguoiPT={setLocNguoiPT}
      />

      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={moFormThem}>
          Thêm phòng học
        </Button>
      </div>

      <BangPhongHoc
        danhSach={dsHienThi}
        onSua={moFormSua}
        onXoa={xoaPhongHoc}
      />

      <FormPhongHoc
        visible={hienModal}
        dangSua={dangSua}
        form={form}
        onLuu={xuLyLuu}
        onDong={dongModal}
      />
    </div>
  );
};

export default GiuaKy;