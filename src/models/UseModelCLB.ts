import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { KHOA_LUU_TRU_CLB } from './constants';
import { KieuCauLacBo, KieuDonDangKy, TrangThaiDon } from './types';

export default function useModelCLB() {
  /* ==================== STATE ==================== */
  const [danhSachCLB, setDanhSachCLB] = useState<KieuCauLacBo[]>(() =>
    JSON.parse(localStorage.getItem(KHOA_LUU_TRU_CLB.DANH_SACH_CLB) || '[]'),
  );

  const [danhSachDon, setDanhSachDon] = useState<KieuDonDangKy[]>(() =>
    JSON.parse(localStorage.getItem(KHOA_LUU_TRU_CLB.DON_DANG_KY) || '[]'),
  );

  /* ==================== ĐỒNG BỘ LOCALSTORAGE ==================== */
  useEffect(() => {
    localStorage.setItem(KHOA_LUU_TRU_CLB.DANH_SACH_CLB, JSON.stringify(danhSachCLB));
  }, [danhSachCLB]);

  useEffect(() => {
    localStorage.setItem(KHOA_LUU_TRU_CLB.DON_DANG_KY, JSON.stringify(danhSachDon));
  }, [danhSachDon]);

  /* ==================== NGHIỆP VỤ CLB ==================== */

  /** Thêm mới câu lạc bộ */
  const themCLB = useCallback((clbMoi: Omit<KieuCauLacBo, 'id'>) => {
    const banGhiMoi: KieuCauLacBo = { ...clbMoi, id: `CLB_${Date.now()}` };
    setDanhSachCLB((ds) => [...ds, banGhiMoi]);
    message.success('Thêm câu lạc bộ thành công!');
  }, []);

  /** Cập nhật câu lạc bộ */
  const suaCLB = useCallback((id: string, duLieuCapNhat: Partial<KieuCauLacBo>) => {
    setDanhSachCLB((ds) =>
      ds.map((clb) => (clb.id === id ? { ...clb, ...duLieuCapNhat } : clb)),
    );
    message.success('Cập nhật câu lạc bộ thành công!');
  }, []);

  /** Xóa câu lạc bộ */
  const xoaCLB = useCallback((id: string) => {
    setDanhSachCLB((ds) => ds.filter((clb) => clb.id !== id));
    message.success('Đã xóa câu lạc bộ!');
  }, []);

  /* ==================== NGHIỆP VỤ ĐƠN ĐĂNG KÝ ==================== */

  /** Thêm mới đơn đăng ký */
  const themDon = useCallback((donMoi: Omit<KieuDonDangKy, 'id' | 'trangThai' | 'lichSu'>) => {
    const banGhiMoi: KieuDonDangKy = {
      ...donMoi,
      id: `DON_${Date.now()}`,
      trangThai: 'Pending',
      lichSu: [
        {
          thoiGian: new Date().toLocaleString('vi-VN'),
          hanhDong: 'Tạo đơn đăng ký mới',
        },
      ],
    };
    setDanhSachDon((ds) => [...ds, banGhiMoi]);
    message.success('Thêm đơn đăng ký thành công!');
  }, []);

  /** Cập nhật đơn đăng ký */
  const suaDon = useCallback((id: string, duLieuCapNhat: Partial<KieuDonDangKy>) => {
    setDanhSachDon((ds) =>
      ds.map((don) => (don.id === id ? { ...don, ...duLieuCapNhat } : don)),
    );
    message.success('Cập nhật đơn đăng ký thành công!');
  }, []);

  /** Xóa đơn đăng ký */
  const xoaDon = useCallback((id: string) => {
    setDanhSachDon((ds) => ds.filter((don) => don.id !== id));
    message.success('Đã xóa đơn đăng ký!');
  }, []);

  /** Duyệt hoặc từ chối nhiều đơn cùng lúc */
  const xuLyDuyetDon = useCallback(
    (danhSachId: string[], trangThaiMoi: TrangThaiDon, lyDo?: string) => {
      const thoiGian = new Date().toLocaleString('vi-VN');
      setDanhSachDon((ds) =>
        ds.map((don) => {
          if (danhSachId.includes(don.id)) {
            const nhatKy = {
              thoiGian,
              hanhDong: `Admin đã ${trangThaiMoi} vào lúc ${thoiGian}`,
              ghiChu: lyDo,
            };
            return {
              ...don,
              trangThai: trangThaiMoi,
              ghiChu: lyDo || don.ghiChu,
              lichSu: [...(don.lichSu || []), nhatKy],
            };
          }
          return don;
        }),
      );
      message.success(`Đã cập nhật trạng thái cho ${danhSachId.length} đơn!`);
    },
    [],
  );

  /* ==================== NGHIỆP VỤ THÀNH VIÊN ==================== */

  /** Chuyển CLB cho nhiều thành viên */
  const chuyenCLBThanhVien = useCallback(
    (danhSachId: string[], idCLBMoi: string) => {
      setDanhSachDon((ds) =>
        ds.map((don) =>
          danhSachId.includes(don.id) ? { ...don, idCLB: idCLBMoi } : don,
        ),
      );
      message.success(`Đã chuyển CLB cho ${danhSachId.length} thành viên!`);
    },
    [],
  );

  /* ==================== RETURN ==================== */
  return {
    danhSachCLB,
    setDanhSachCLB,
    themCLB,
    suaCLB,
    xoaCLB,

    danhSachDon,
    setDanhSachDon,
    themDon,
    suaDon,
    xoaDon,
    xuLyDuyetDon,

    chuyenCLBThanhVien,
  };
}