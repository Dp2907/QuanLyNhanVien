import { Worker } from "../../models/worker.js";
import { Validation } from "../../models/validation.js";

let arrData = [];

const getFullData = () => {
  const promise = axios({
    url: "http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayDanhSachNhanVien",
    method: "get",
  })
    .then((res) => {
      arrData = [];
      for (let item of res.data) {
        let worker = new Worker(
          item.maNhanVien,
          item.tenNhanVien,
          item.chucVu,
          item.heSoChucVu,
          item.luongCoBan,
          item.soGioLamTrongThang
        );
        arrData.push(worker);
      }

      return renderTable(arrData);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
const getData = (id) => {
  const promise = axios({
    url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/LayThongTinNhanVien?maNhanVien=${id}`,
    method: "get",
  })
    .then((result) => {
      const worker = result.data;
      document.querySelector("#id").value = worker.maNhanVien;
      document.querySelector("#name").value = worker.tenNhanVien;
      document.querySelector("#type").selectedIndex = worker.heSoChucVu - 1;
      document.querySelector("#basicSalary").value = worker.luongCoBan;
      document.querySelector("#timeWork").value = worker.soGioLamTrongThang;
    })
    .catch((err) => {
      console.log(err);
    });
};
const postData = (obj) => {
  const promise = axios({
    url: "http://svcy.myclass.vn/api/QuanLyNhanVienApi/ThemNhanVien",
    method: "post",
    data: obj,
  })
    .then((res) => {
      console.log(res.data);
      getFullData();
    })
    .catch((err) => console.log(err.response.data));
};
const deleteData = (id) => {
  const promise = axios({
    url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/XoaNhanVien?maSinhVien=${id}`,
    method: "delete",
  })
    .then((result) => {
      console.log(result);
      return getFullData();
    })
    .catch((err) => {
      console.log(err);
    });
};
const putData = (id, obj) => {
  const promise = axios({
    url: `http://svcy.myclass.vn/api/QuanLyNhanVienApi/CapNhatThongTinNhanVien?maNhanVien=${id}`,
    method: "put",
    data: obj,
  });

  promise
    .then((res) => {
      console.log(res.data);
      return getFullData();
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};
const changeData = (id) => {
  getData(id);
  document.querySelector("#id").disabled = true;
  document.querySelector("#postBtn").disabled = true;
  document.querySelector("#putBtn").disabled = false;
};
const renderTable = (arr) => {
  let content = "";
  for (let item of arr) {
    let tr = `
      <tr class = 'border-top'>
        <td class = 'p-3'>${item.maNhanVien}</td>
        <td class = 'p-3'>${item.tenNhanVien}</td>
        <td class = 'p-3'>${item.chucVu}</td>
        <td class = 'p-3'>${item.luongCoBan}</td>
        <td class = 'p-3'>${item.totalSalary()}</td>
        <td class = 'p-3'>${item.soGioLamTrongThang}</td>
        <td class = 'p-3'>${item.grade()}</td>
        <td class = 'p-3'>
          <button class="btn btn-danger" onclick="deleteData('${
            item.maNhanVien
          }')">Xoá</button>
        </td>
        <td class = 'p-3'>
          <button class="btn btn-primary" onclick="changeData('${
            item.maNhanVien
          }')">Sửa</button>
        </td>
      </tr>
    `;
    content += tr;
  }
  document.querySelector("#table-content").innerHTML = content;
};

window.deleteData = (id) => deleteData(id);
window.changeData = (id) => changeData(id);
getFullData();

document.querySelector("#postBtn").onclick = () => {
  let id = document.querySelector("#id").value;
  let name = document.querySelector("#name").value;
  let typeWorker =
    document.querySelector("#type").options[type.selectedIndex].innerHTML;
  let typeValue =
    document.querySelector("#type").options[type.selectedIndex].value;
  let basicSalary = document.querySelector("#basicSalary").value;
  let timeWork = document.querySelector("#timeWork").value;

  // Validation
  let valid = true;
  let validation = new Validation();
  // Check null
  valid &=
    validation.null(id, "#nullErrID", "Mã nhân viên") &
    validation.null(name, "#nullErrName", "Tên nhân viên") &
    validation.null(basicSalary, "#nullErrBSalary", "Lương cơ bản") &
    validation.null(timeWork, "#nullErrTimeWork", "Số giờ làm trong tháng");
  // Check number
  valid &=
    validation.number(id, "#numberErrID", "Mã nhân viên") &
    validation.number(basicSalary, "#numberErrBSalary", "Lương cơ bản") &
    validation.number(timeWork, "#numberErrTimeWork", "Số giờ làm trong tháng");
  // Check length
  valid &= validation.length(id, "#lengthErrID", "Mã nhân viên", 4, 6);
  valid &= validation.letter(name, "#letterErrName", "Tên nhân viên");
  // Check value
  valid &=
    validation.valueBetween(
      basicSalary,
      "#valueErrBSalary",
      "Lương cơ bản",
      1000000,
      20000000
    ) &
    validation.valueBetween(
      timeWork,
      "#valueErrTimeWork",
      "Số giờ làm trong tháng",
      50,
      150
    );
  if (!valid) return;
  // Check letter

  const worker = new Worker(
    id,
    name,
    typeWorker,
    typeValue,
    basicSalary,
    timeWork
  );

  postData(worker);

  document.querySelector("#id").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#type").selectedIndex = 0;
  document.querySelector("#basicSalary").value = "";
  document.querySelector("#timeWork").value = "";
};
document.querySelector("#putBtn").onclick = () => {
  document.querySelector("#id").disabled = false;
  document.querySelector("#postBtn").disabled = false;
  document.querySelector("#putBtn").disabled = true;

  let id = document.querySelector("#id").value;
  let name = document.querySelector("#name").value;
  let typeWorker =
    document.querySelector("#type").options[type.selectedIndex].innerHTML;
  let typeValue =
    document.querySelector("#type").options[type.selectedIndex].value;
  let basicSalary = document.querySelector("#basicSalary").value;
  let timeWork = document.querySelector("#timeWork").value;

  // Validation
  let valid = true;
  let validation = new Validation();
  // Check null
  valid &=
    validation.null(id, "#nullErrID", "Mã nhân viên") &
    validation.null(name, "#nullErrName", "Tên nhân viên") &
    validation.null(basicSalary, "#nullErrBSalary", "Lương cơ bản") &
    validation.null(timeWork, "#nullErrTimeWork", "Số giờ làm trong tháng");
  // Check number
  valid &=
    validation.number(id, "#numberErrID", "Mã nhân viên") &
    validation.number(basicSalary, "#numberErrBSalary", "Lương cơ bản") &
    validation.number(timeWork, "#numberErrTimeWork", "Số giờ làm trong tháng");
  // Check length
  valid &= validation.length(id, "#lengthErrID", "Mã nhân viên", 4, 6);
  valid &= validation.letter(name, "#letterErrName", "Tên nhân viên");
  // Check value
  valid &=
    validation.valueBetween(
      basicSalary,
      "#valueErrBSalary",
      "Lương cơ bản",
      1000000,
      20000000
    ) &
    validation.valueBetween(
      timeWork,
      "#valueErrTimeWork",
      "Số giờ làm trong tháng",
      50,
      150
    );
  if (!valid) return;
  // Check letter

  const worker = new Worker(
    id,
    name,
    typeWorker,
    typeValue,
    basicSalary,
    timeWork
  );

  putData(id, worker);

  document.querySelector("#id").value = "";
  document.querySelector("#name").value = "";
  document.querySelector("#type").selectedIndex = 0;
  document.querySelector("#basicSalary").value = "";
  document.querySelector("#timeWork").value = "";
};
