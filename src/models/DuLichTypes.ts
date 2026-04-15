export type KieuLoaiHinh = 'bien' | 'nui' | 'thanhPho';

// Hạng mục chi phí
export type KieuHangMuc = 'anUong' | 'luuTru' | 'diChuyen' | 'veVao' | 'khac';

// Chi phí của 1 điểm đến
export interface KieuChiPhi {
  anUong: number;
  luuTru: number;
  diChuyen: number;
  veVao: number;
  khac: number;
}

// Thông tin 1 điểm đến
export interface KieuDiemDen {
  id: string;
  tenDiemDen: string;
  hinhAnh: string;
  moTa: string;
  loaiHinh: KieuLoaiHinh;
  danhGia: number;
  thoiGianThamQuan: number;
  chiPhi: KieuChiPhi;
  diaChi: string;
}

// 1 điểm đến trong ngày lịch trình
export interface KieuDiemDenTrongNgay {
  idDiemDen: string;
  thuTu: number;
  ghiChu?: string;
}

// 1 ngày trong lịch trình
export interface KieuNgayLichTrinh {
  ngay: number;
  danhSachDiemDen: KieuDiemDenTrongNgay[];
}

// 1 lịch trình du lịch
export interface KieuLichTrinh {
  id: string;
  tenLichTrinh: string;
  ngayTao: string;
  nganSachToiDa: number;
  danhSachNgay: KieuNgayLichTrinh[];
}

// Dùng cho thống kê
export interface KieuThongKeLichTrinh {
  thang: string;
  soLuong: number;
}

export interface KieuThongKeDiemDen {
  tenDiemDen: string;
  soLanChon: number;
}