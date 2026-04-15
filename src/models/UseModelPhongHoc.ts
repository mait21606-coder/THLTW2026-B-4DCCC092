import { useState, useEffect } from 'react';
import { message } from 'antd';

export const NHAN_LOAI_PHONG: any = {
  lyThuyet: 'Lý thuyết',
  thucHanh: 'Thực hành',
  hoiTruong: 'Hội trường',
};

export const MAU_LOAI_PHONG: any = {
  lyThuyet: 'blue',
  thucHanh: 'green',
  hoiTruong: 'orange',
};

export const DS_LOAI_PHONG = [
  { value: 'lyThuyet', label: 'Lý thuyết' },
  { value: 'thucHanh', label: 'Thực hành' },
  { value: 'hoiTruong', label: 'Hội trường' },
];

export const DS_NGUOI_PHU_TRACH = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E',
];

const DU_LIEU_MAU = [
  { id: '1', maPhong: 'A101', tenPhong: 'Phòng học lý thuyết 1', soChoNgoi: 50, loaiPhong: 'lyThuyet', nguoiPhuTrach: 'Nguyễn Văn A' },
  { id: '2', maPhong: 'B201', tenPhong: 'Phòng thực hành máy tính', soChoNgoi: 40, loaiPhong: 'thucHanh', nguoiPhuTrach: 'Trần Thị B' },
  { id: '3', maPhong: 'C301', tenPhong: 'Hội trường lớn', soChoNgoi: 200, loaiPhong: 'hoiTruong', nguoiPhuTrach: 'Lê Văn C' },
  { id: '4', maPhong: 'A102', tenPhong: 'Phòng học nhỏ', soChoNgoi: 25, loaiPhong: 'lyThuyet', nguoiPhuTrach: 'Phạm Thị D' },
  { id: '5', maPhong: 'B202', tenPhong: 'Phòng lab vật lý', soChoNgoi: 30, loaiPhong: 'thucHanh', nguoiPhuTrach: 'Hoàng Văn E' },
];

export default function useModelPhongHoc() {
  const [danhSach, setDanhSach] = useState(() => {
    const luu = localStorage.getItem('PHONG_HOC_DATA');
    if (luu) return JSON.parse(luu);
    return DU_LIEU_MAU;
  });

  useEffect(() => {
    localStorage.setItem('PHONG_HOC_DATA', JSON.stringify(danhSach));
  }, [danhSach]);

  const themPhongHoc = (duLieu: any) => {
    for (let i = 0; i < danhSach.length; i++) {
      if (danhSach[i].maPhong.toLowerCase() === duLieu.maPhong.toLowerCase()) {
        message.error('Mã phòng đã tồn tại!');
        return false;
      }
      if (danhSach[i].tenPhong.toLowerCase() === duLieu.tenPhong.toLowerCase()) {
        message.error('Tên phòng đã tồn tại!');
        return false;
      }
    }
    const moi = {
      id: 'PH_' + Date.now(),
      maPhong: duLieu.maPhong,
      tenPhong: duLieu.tenPhong,
      soChoNgoi: duLieu.soChoNgoi,
      loaiPhong: duLieu.loaiPhong,
      nguoiPhuTrach: duLieu.nguoiPhuTrach,
    };
    setDanhSach([...danhSach, moi]);
    message.success('Thêm thành công!');
    return true;
  };

  const suaPhongHoc = (id: any, duLieu: any) => {
    for (let i = 0; i < danhSach.length; i++) {
      if (danhSach[i].id === id) continue;
      if (danhSach[i].maPhong.toLowerCase() === duLieu.maPhong.toLowerCase()) {
        message.error('Mã phòng đã tồn tại!');
        return false;
      }
      if (danhSach[i].tenPhong.toLowerCase() === duLieu.tenPhong.toLowerCase()) {
        message.error('Tên phòng đã tồn tại!');
        return false;
      }
    }
    const ds: any[] = [];
    for (let i = 0; i < danhSach.length; i++) {
      if (danhSach[i].id === id) {
        ds.push({
          id: id,
          maPhong: duLieu.maPhong,
          tenPhong: duLieu.tenPhong,
          soChoNgoi: duLieu.soChoNgoi,
          loaiPhong: duLieu.loaiPhong,
          nguoiPhuTrach: duLieu.nguoiPhuTrach,
        });
      } else {
        ds.push(danhSach[i]);
      }
    }
    setDanhSach(ds);
    message.success('Cập nhật thành công!');
    return true;
  };

  const xoaPhongHoc = (id: any) => {
    let phong = null;
    for (let i = 0; i < danhSach.length; i++) {
      if (danhSach[i].id === id) {
        phong = danhSach[i];
        break;
      }
    }
    if (!phong) return false;
    if (phong.soChoNgoi >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ ngồi!');
      return false;
    }
    const ds: any[] = [];
    for (let i = 0; i < danhSach.length; i++) {
      if (danhSach[i].id !== id) {
        ds.push(danhSach[i]);
      }
    }
    setDanhSach(ds);
    message.success('Đã xóa!');
    return true;
  };

  return { danhSach, themPhongHoc, suaPhongHoc, xoaPhongHoc };
}