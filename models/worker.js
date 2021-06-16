export class Worker {
  constructor(id, name, type, typeValue, basicSalary, timeWork) {
    this.maNhanVien = Number(id);
    this.tenNhanVien = name;
    this.chucVu = type;
    this.heSoChucVu = Number(typeValue);
    this.luongCoBan = Number(basicSalary);
    this.soGioLamTrongThang = Number(timeWork);
  }

  totalSalary() {
    return this.luongCoBan * this.heSoChucVu;
  }

  grade() {
    if (this.soGioLamTrongThang >= 120) return "Nhân viên xuất sắc";
    else if (this.soGioLamTrongThang >= 100) return "Nhân viên giỏi";
    else if (this.soGioLamTrongThang >= 80) return "Nhân viên khá";
    else if (this.soGioLamTrongThang >= 50) return "Nhân viên trung bình";
    return "Không thể xếp loại";
  }
}
