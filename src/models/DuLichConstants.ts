import type { KieuDiemDen } from './duLichTypes';

// Key lưu vào localStorage
export const KHOA_LUU_TRU = {
  DIEM_DEN: 'DL_DIEM_DEN',
  LICH_TRINH: 'DL_LICH_TRINH',
};

// Tên hiển thị của loại hình
export const NHAN_LOAI_HINH: Record<string, string> = {
  bien: '🏖️ Biển',
  nui: '⛰️ Núi',
  thanhPho: '🏙️ Thành phố',
};

// Tên hiển thị của hạng mục chi phí
export const NHAN_HANG_MUC: Record<string, string> = {
  anUong: '🍜 Ăn uống',
  luuTru: '🏨 Lưu trú',
  diChuyen: '🚗 Di chuyển',
  veVao: '🎫 Vé vào cửa',
  khac: '📦 Khác',
};

// Màu sắc cho từng hạng mục
export const MAU_HANG_MUC: Record<string, string> = {
  anUong: '#ff6b6b',
  luuTru: '#4ecdc4',
  diChuyen: '#45b7d1',
  veVao: '#f9ca24',
  khac: '#a29bfe',
};

// Danh sách loại hình cho Select
export const DS_LOAI_HINH = [
  { value: 'bien', label: '🏖️ Biển' },
  { value: 'nui', label: '⛰️ Núi' },
  { value: 'thanhPho', label: '🏙️ Thành phố' },
];

// Dữ liệu mẫu 10 điểm đến
export const DU_LIEU_MAU_DIEM_DEN: KieuDiemDen[] = [
  {
    id: 'DD_001',
    tenDiemDen: 'Vịnh Hạ Long',
    hinhAnh: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&h=300&fit=crop',
    moTa: 'Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ.',
    loaiHinh: 'bien',
    danhGia: 5,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 500000, luuTru: 800000, diChuyen: 300000, veVao: 250000, khac: 100000 },
    diaChi: 'Quảng Ninh',
  },
  {
    id: 'DD_002',
    tenDiemDen: 'Sapa',
    hinhAnh: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=400&h=300&fit=crop',
    moTa: 'Thị trấn trên mây với ruộng bậc thang tuyệt đẹp.',
    loaiHinh: 'nui',
    danhGia: 5,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 400000, luuTru: 600000, diChuyen: 200000, veVao: 100000, khac: 150000 },
    diaChi: 'Lào Cai',
  },
  {
    id: 'DD_003',
    tenDiemDen: 'Phố cổ Hội An',
    hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&h=300&fit=crop',
    moTa: 'Di sản văn hóa thế giới với kiến trúc cổ kính, đèn lồng lung linh.',
    loaiHinh: 'thanhPho',
    danhGia: 5,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 350000, luuTru: 500000, diChuyen: 150000, veVao: 120000, khac: 100000 },
    diaChi: 'Quảng Nam',
  },
  {
    id: 'DD_004',
    tenDiemDen: 'Đà Lạt',
    hinhAnh: 'https://images.unsplash.com/photo-1600398237989-fe46b76be824?w=400&h=300&fit=crop',
    moTa: 'Thành phố ngàn hoa giữa cao nguyên, khí hậu mát mẻ.',
    loaiHinh: 'nui',
    danhGia: 4,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 350000, luuTru: 500000, diChuyen: 200000, veVao: 80000, khac: 100000 },
    diaChi: 'Lâm Đồng',
  },
  {
    id: 'DD_005',
    tenDiemDen: 'Phú Quốc',
    hinhAnh: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop',
    moTa: 'Đảo ngọc phương Nam với bãi biển cát trắng, nước biển trong vắt.',
    loaiHinh: 'bien',
    danhGia: 4,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 600000, luuTru: 1000000, diChuyen: 400000, veVao: 200000, khac: 200000 },
    diaChi: 'Kiên Giang',
  },
  {
    id: 'DD_006',
    tenDiemDen: 'Huế',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
    moTa: 'Cố đô với hệ thống lăng tẩm, cung điện triều Nguyễn.',
    loaiHinh: 'thanhPho',
    danhGia: 4,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 300000, luuTru: 400000, diChuyen: 150000, veVao: 150000, khac: 80000 },
    diaChi: 'Thừa Thiên Huế',
  },
  {
    id: 'DD_007',
    tenDiemDen: 'Nha Trang',
    hinhAnh: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=400&h=300&fit=crop',
    moTa: 'Thành phố biển nổi tiếng với bãi biển dài, đảo đẹp.',
    loaiHinh: 'bien',
    danhGia: 4,
    thoiGianThamQuan: 7,
    chiPhi: { anUong: 450000, luuTru: 700000, diChuyen: 250000, veVao: 300000, khac: 150000 },
    diaChi: 'Khánh Hòa',
  },
  {
    id: 'DD_008',
    tenDiemDen: 'Hà Giang',
    hinhAnh: 'https://images.unsplash.com/photo-1633871957631-c5f65784e3d4?w=400&h=300&fit=crop',
    moTa: 'Cao nguyên đá hùng vĩ, con đường Hạnh Phúc.',
    loaiHinh: 'nui',
    danhGia: 5,
    thoiGianThamQuan: 10,
    chiPhi: { anUong: 300000, luuTru: 350000, diChuyen: 250000, veVao: 50000, khac: 100000 },
    diaChi: 'Hà Giang',
  },
  {
    id: 'DD_009',
    tenDiemDen: 'TP. Hồ Chí Minh',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop',
    moTa: 'Thành phố năng động nhất Việt Nam.',
    loaiHinh: 'thanhPho',
    danhGia: 4,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 400000, luuTru: 600000, diChuyen: 200000, veVao: 100000, khac: 200000 },
    diaChi: 'TP. Hồ Chí Minh',
  },
  {
    id: 'DD_010',
    tenDiemDen: 'Mũi Né',
    hinhAnh: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=400&h=300&fit=crop',
    moTa: 'Thiên đường cát trắng với đồi cát bay, bãi biển đẹp.',
    loaiHinh: 'bien',
    danhGia: 4,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 350000, luuTru: 500000, diChuyen: 200000, veVao: 70000, khac: 100000 },
    diaChi: 'Bình Thuận',
  },
];