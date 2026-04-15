export type TrangThaiDon = 'Pending' | 'Approved' | 'Rejected';

/** Giới tính */
export type KieuGioiTinh = 'Nam' | 'Nữ' | 'Khác';

/** Lịch sử thao tác (duyệt/từ chối) */
export interface KieuLichSuThaoTac {
  thoiGian: string;
  hanhDong: string;
  ghiChu?: string;
}

/** Thông tin Câu lạc bộ */
export interface KieuCauLacBo {
  id: string;
  anhDaiDien?: string;
  tenCLB: string;
  ngayThanhLap: string;
  moTa?: string;
  chuNhiem: string;
  dangHoatDong: boolean;
}

/** Đơn đăng ký thành viên */
export interface KieuDonDangKy {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  gioiTinh: KieuGioiTinh;
  diaChi: string;
  soTruong: string;
  idCLB: string;
  lyDoDangKy: string;
  trangThai: TrangThaiDon;
  ghiChu?: string;
  lichSu: KieuLichSuThaoTac[];
}