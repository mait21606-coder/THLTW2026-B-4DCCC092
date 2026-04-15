import { useState, useEffect } from 'react';
import { message } from 'antd';
import { KHOA_LUU_TRU, DU_LIEU_MAU_DIEM_DEN } from './duLichConstants';
import type { KieuDiemDen, KieuLichTrinh, KieuNgayLichTrinh, KieuChiPhi, KieuHangMuc } from './duLichTypes';

export default function useModelDuLich() {

  // ==================== STATE ====================
  // Lấy dữ liệu từ localStorage, nếu chưa có thì dùng dữ liệu mẫu
  const layDuLieuBanDau = () => {
    const duLieuLuu = localStorage.getItem(KHOA_LUU_TRU.DIEM_DEN);
    if (duLieuLuu) {
      return JSON.parse(duLieuLuu);
    }
    return DU_LIEU_MAU_DIEM_DEN;
  };

  const [danhSachDiemDen, setDanhSachDiemDen] = useState<KieuDiemDen[]>(layDuLieuBanDau);
  const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<KieuLichTrinh[]>(
    JSON.parse(localStorage.getItem(KHOA_LUU_TRU.LICH_TRINH) || '[]')
  );

  // ==================== LƯU VÀO LOCALSTORAGE KHI DỮ LIỆU THAY ĐỔI ====================
  useEffect(() => {
    localStorage.setItem(KHOA_LUU_TRU.DIEM_DEN, JSON.stringify(danhSachDiemDen));
  }, [danhSachDiemDen]);

  useEffect(() => {
    localStorage.setItem(KHOA_LUU_TRU.LICH_TRINH, JSON.stringify(danhSachLichTrinh));
  }, [danhSachLichTrinh]);

  // ==================== THÊM / SỬA / XÓA ĐIỂM ĐẾN ====================

  // Thêm 1 điểm đến mới
  const themDiemDen = (diemDenMoi: any) => {
    const banGhiMoi = {
      ...diemDenMoi,
      id: 'DD_' + Date.now(),
    };
    setDanhSachDiemDen([...danhSachDiemDen, banGhiMoi]);
    message.success('Thêm điểm đến thành công!');
  };

  // Sửa 1 điểm đến
  const suaDiemDen = (id: string, duLieu: any) => {
    const danhSachMoi = danhSachDiemDen.map((dd) => {
      if (dd.id === id) {
        return { ...dd, ...duLieu };
      }
      return dd;
    });
    setDanhSachDiemDen(danhSachMoi);
    message.success('Cập nhật điểm đến thành công!');
  };

  // Xóa 1 điểm đến
  const xoaDiemDen = (id: string) => {
    const danhSachMoi = danhSachDiemDen.filter((dd) => dd.id !== id);
    setDanhSachDiemDen(danhSachMoi);
    message.success('Đã xóa điểm đến!');
  };

  // ==================== THÊM / XÓA LỊCH TRÌNH ====================

  // Tạo 1 lịch trình mới
  const themLichTrinh = (tenLichTrinh: string, nganSachToiDa: number) => {
    const lichTrinhMoi: KieuLichTrinh = {
      id: 'LT_' + Date.now(),
      tenLichTrinh: tenLichTrinh,
      ngayTao: new Date().toISOString(),
      nganSachToiDa: nganSachToiDa,
      danhSachNgay: [{ ngay: 1, danhSachDiemDen: [] }], // mặc định có 1 ngày
    };
    setDanhSachLichTrinh([...danhSachLichTrinh, lichTrinhMoi]);
    message.success('Tạo lịch trình thành công!');
    return lichTrinhMoi.id;
  };

  // Xóa 1 lịch trình
  const xoaLichTrinh = (id: string) => {
    const danhSachMoi = danhSachLichTrinh.filter((lt) => lt.id !== id);
    setDanhSachLichTrinh(danhSachMoi);
    message.success('Đã xóa lịch trình!');
  };

  // ==================== QUẢN LÝ NGÀY TRONG LỊCH TRÌNH ====================

  // Thêm 1 ngày vào lịch trình
  const themNgay = (idLichTrinh: string) => {
    const danhSachMoi = danhSachLichTrinh.map((lt) => {
      if (lt.id === idLichTrinh) {
        const soNgayMoi = lt.danhSachNgay.length + 1;
        return {
          ...lt,
          danhSachNgay: [...lt.danhSachNgay, { ngay: soNgayMoi, danhSachDiemDen: [] }],
        };
      }
      return lt;
    });
    setDanhSachLichTrinh(danhSachMoi);
  };

  // Xóa 1 ngày khỏi lịch trình
  const xoaNgay = (idLichTrinh: string, soNgay: number) => {
    const danhSachMoi = danhSachLichTrinh.map((lt) => {
      if (lt.id === idLichTrinh) {
        // Lọc bỏ ngày cần xóa, rồi đánh số lại
        const ngayConLai = lt.danhSachNgay.filter((n) => n.ngay !== soNgay);
        const ngayDaDanhSoLai = ngayConLai.map((n, i) => ({ ...n, ngay: i + 1 }));
        return { ...lt, danhSachNgay: ngayDaDanhSoLai };
      }
      return lt;
    });
    setDanhSachLichTrinh(danhSachMoi);
  };

  // ==================== QUẢN LÝ ĐIỂM ĐẾN TRONG NGÀY ====================

  // Thêm 1 điểm đến vào 1 ngày
  const themDiemDenVaoNgay = (idLichTrinh: string, soNgay: number, idDiemDen: string) => {
    const danhSachMoi = danhSachLichTrinh.map((lt) => {
      if (lt.id === idLichTrinh) {
        const ngayMoi = lt.danhSachNgay.map((n) => {
          if (n.ngay === soNgay) {
            const thuTuMoi = n.danhSachDiemDen.length + 1;
            return {
              ...n,
              danhSachDiemDen: [...n.danhSachDiemDen, { idDiemDen: idDiemDen, thuTu: thuTuMoi }],
            };
          }
          return n;
        });
        return { ...lt, danhSachNgay: ngayMoi };
      }
      return lt;
    });
    setDanhSachLichTrinh(danhSachMoi);
  };

  // Xóa 1 điểm đến khỏi 1 ngày
  const xoaDiemDenKhoiNgay = (idLichTrinh: string, soNgay: number, idDiemDen: string) => {
    const danhSachMoi = danhSachLichTrinh.map((lt) => {
      if (lt.id === idLichTrinh) {
        const ngayMoi = lt.danhSachNgay.map((n) => {
          if (n.ngay === soNgay) {
            // Lọc bỏ điểm đến, đánh số thứ tự lại
            const diemDenConLai = n.danhSachDiemDen
              .filter((dd) => dd.idDiemDen !== idDiemDen)
              .map((dd, i) => ({ ...dd, thuTu: i + 1 }));
            return { ...n, danhSachDiemDen: diemDenConLai };
          }
          return n;
        });
        return { ...lt, danhSachNgay: ngayMoi };
      }
      return lt;
    });
    setDanhSachLichTrinh(danhSachMoi);
  };

  // Di chuyển điểm đến lên/xuống trong 1 ngày
  const diChuyenDiemDen = (idLichTrinh: string, soNgay: number, viTriCu: number, viTriMoi: number) => {
    const danhSachMoi = danhSachLichTrinh.map((lt) => {
      if (lt.id === idLichTrinh) {
        const ngayMoi = lt.danhSachNgay.map((n) => {
          if (n.ngay === soNgay) {
            // Copy mảng, đổi chỗ 2 phần tử
            const dsMoi = [...n.danhSachDiemDen];
            const phanTu = dsMoi.splice(viTriCu, 1)[0]; // lấy phần tử ra
            dsMoi.splice(viTriMoi, 0, phanTu); // chèn vào vị trí mới
            // Đánh số thứ tự lại
            const dsDaDanhSo = dsMoi.map((dd, i) => ({ ...dd, thuTu: i + 1 }));
            return { ...n, danhSachDiemDen: dsDaDanhSo };
          }
          return n;
        });
        return { ...lt, danhSachNgay: ngayMoi };
      }
      return lt;
    });
    setDanhSachLichTrinh(danhSachMoi);
  };

  // ==================== TÍNH TOÁN CHI PHÍ ====================

  // Tính tổng chi phí của 1 điểm đến
  const tinhTongChiPhiDiemDen = (chiPhi: KieuChiPhi) => {
    return chiPhi.anUong + chiPhi.luuTru + chiPhi.diChuyen + chiPhi.veVao + chiPhi.khac;
  };

  // Tính tổng chi phí của 1 ngày
  const tinhChiPhiNgay = (ngay: KieuNgayLichTrinh) => {
    let tongChi = 0;
    for (let i = 0; i < ngay.danhSachDiemDen.length; i++) {
      const diemDen = danhSachDiemDen.find((dd) => dd.id === ngay.danhSachDiemDen[i].idDiemDen);
      if (diemDen) {
        tongChi = tongChi + tinhTongChiPhiDiemDen(diemDen.chiPhi);
      }
    }
    return tongChi;
  };

  // Tính tổng chi phí của cả lịch trình
  const tinhTongChiPhiLichTrinh = (lichTrinh: KieuLichTrinh) => {
    let tongChi = 0;
    for (let i = 0; i < lichTrinh.danhSachNgay.length; i++) {
      tongChi = tongChi + tinhChiPhiNgay(lichTrinh.danhSachNgay[i]);
    }
    return tongChi;
  };

  // Tính chi phí theo từng hạng mục cho 1 lịch trình
  const tinhChiPhiTheoHangMuc = (lichTrinh: KieuLichTrinh) => {
    const ketQua = { anUong: 0, luuTru: 0, diChuyen: 0, veVao: 0, khac: 0 };
    for (let i = 0; i < lichTrinh.danhSachNgay.length; i++) {
      const ngay = lichTrinh.danhSachNgay[i];
      for (let j = 0; j < ngay.danhSachDiemDen.length; j++) {
        const diemDen = danhSachDiemDen.find((dd) => dd.id === ngay.danhSachDiemDen[j].idDiemDen);
        if (diemDen) {
          ketQua.anUong += diemDen.chiPhi.anUong;
          ketQua.luuTru += diemDen.chiPhi.luuTru;
          ketQua.diChuyen += diemDen.chiPhi.diChuyen;
          ketQua.veVao += diemDen.chiPhi.veVao;
          ketQua.khac += diemDen.chiPhi.khac;
        }
      }
    }
    return ketQua;
  };

  // Tính tổng thời gian tham quan của 1 ngày
  const tinhThoiGianNgay = (ngay: KieuNgayLichTrinh) => {
    let tongGio = 0;
    for (let i = 0; i < ngay.danhSachDiemDen.length; i++) {
      const diemDen = danhSachDiemDen.find((dd) => dd.id === ngay.danhSachDiemDen[i].idDiemDen);
      if (diemDen) {
        tongGio = tongGio + diemDen.thoiGianThamQuan;
      }
    }
    return tongGio;
  };

  // Ước tính thời gian di chuyển (1h mỗi lần di chuyển giữa 2 điểm)
  const tinhThoiGianDiChuyenNgay = (ngay: KieuNgayLichTrinh) => {
    const soDiemDen = ngay.danhSachDiemDen.length;
    if (soDiemDen > 1) {
      return (soDiemDen - 1) * 1; // 1 giờ mỗi lần
    }
    return 0;
  };

  // ==================== TRẢ VỀ TẤT CẢ ====================
  return {
    danhSachDiemDen,
    danhSachLichTrinh,
    themDiemDen,
    suaDiemDen,
    xoaDiemDen,
    themLichTrinh,
    xoaLichTrinh,
    themNgay,
    xoaNgay,
    themDiemDenVaoNgay,
    xoaDiemDenKhoiNgay,
    diChuyenDiemDen,
    tinhTongChiPhiDiemDen,
    tinhChiPhiNgay,
    tinhTongChiPhiLichTrinh,
    tinhChiPhiTheoHangMuc,
    tinhThoiGianNgay,
    tinhThoiGianDiChuyenNgay,
  };
}