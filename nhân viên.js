const ids = [
  'sang2','sang3','sang4','sang5','sang6','sang7','sangCN',
  'chieu2','chieu3','chieu4','chieu5','chieu6','chieu7','chieuCN',
  'toi2','toi3','toi4','toi5','toi6','toi7','toiCN'
];

let dsNV = JSON.parse(localStorage.getItem("dsNV")) || { ql: [], pv: [], tn: [] };
let lichNV = JSON.parse(localStorage.getItem("lichNV")) || {};
let Xoa = false;
let nhanVienHienTai = "";

function hienThi(id) {
  const list = document.getElementById(id);
  list.style.display = (list.style.display === "none" || list.style.display === "") ? "block" : "none";
}

function taoRadio(id, giaTri = "Không") {
  const td = document.getElementById(id);
  td.innerHTML = `
    <label><input type="radio" name="${id}" value="Có" ${giaTri==="Có"?"checked":""}> Có</label>
    <label><input type="radio" name="${id}" value="Không" ${giaTri==="Không"?"checked":""}> Không</label>
  `;
}

function themNhanVien() {
  const nhom = prompt("Thêm vào nhóm nào? (ql/pv/tn): ");
  const ten = prompt("Nhập tên nhân viên:");
  if (!ten || !nhom || !dsNV[nhom]) return alert("❌ Nhóm không hợp lệ hoặc tên trống.");

  const ul = document.getElementById(nhom);
  const li = document.createElement("li");
  li.textContent = ten;
  li.onclick = () => { if (Xoa) {
      if (confirm("Xóa nhân viên '" + ten + "'?")) {
        ul.removeChild(li);
        dsNV[nhom] = dsNV[nhom].filter(t => t !== ten);
        delete lichNV[ten];
        localStorage.setItem("dsNV", JSON.stringify(dsNV));
        localStorage.setItem("lichNV", JSON.stringify(lichNV));
      }
    } else chonNhanVien(ten);
  };
  ul.appendChild(li);
  dsNV[nhom].push(ten);
  lichNV[ten] = {};
  ids.forEach(id => lichNV[ten][id] = "Không");
  localStorage.setItem("dsNV", JSON.stringify(dsNV));
  localStorage.setItem("lichNV", JSON.stringify(lichNV));
  alert("✅ Thêm nhân viên thành công.");
}

function xoaNhanVien() {
  Xoa = !Xoa;
  document.getElementById("xoaNV").textContent = Xoa ? "Chọn tên để xóa" : "- Xóa";
}

function chonNhanVien(ten) {
  nhanVienHienTai = ten;
  document.getElementById("tenNV").innerText = "Lịch làm của: " + ten;
  document.getElementById("ngay").innerText = "Tháng: " + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();

  if (!lichNV[ten]) {
    lichNV[ten] = {};
    ids.forEach(id => lichNV[ten][id] = "Không");
  }

  ids.forEach(id => {
    const val = lichNV[ten][id];
    document.getElementById(id).textContent = (val === "Có") ? "✔" : "";
  });
}

function capNhat() {
  if (!nhanVienHienTai) return alert("⚠ Hãy chọn nhân viên trước!");
  ids.forEach(id => {
    const cell = document.getElementById(id);
    const radios = cell.getElementsByTagName('input');
    let giaTri = lichNV[nhanVienHienTai][id] || "Không";
    for (let i = 0; i < radios.length; i++) if (radios[i].checked) giaTri = radios[i].value;
    lichNV[nhanVienHienTai][id] = giaTri;
    if (giaTri === "Có") {
  cell.innerHTML = "✔";
  cell.classList.add("checked");
} else {
  cell.innerHTML = "";
  cell.classList.remove("checked");
}

  });
  localStorage.setItem("lichNV", JSON.stringify(lichNV));
  alert("💾 Đã lưu lịch cho " + nhanVienHienTai);
}

function resetLuaChon() {
  if (!nhanVienHienTai) return alert("⚠ Hãy chọn nhân viên trước!");
  ids.forEach(id => taoRadio(id, lichNV[nhanVienHienTai][id]));
}

function hienThiDanhSach() {
  for (let nhom in dsNV) {
    const ul = document.getElementById(nhom);
    ul.innerHTML = "";
    dsNV[nhom].forEach(ten => {
      const li = document.createElement("li");
      li.textContent = ten;
      li.onclick = () => { if (Xoa) {
          if (confirm("Xóa nhân viên '" + ten + "'?")) {
            ul.removeChild(li);
            dsNV[nhom] = dsNV[nhom].filter(t => t !== ten);
            delete lichNV[ten];
            localStorage.setItem("dsNV", JSON.stringify(dsNV));
            localStorage.setItem("lichNV", JSON.stringify(lichNV));
          }
        } else chonNhanVien(ten);
      };
      ul.appendChild(li);
    });
  }
}

document.getElementById("search").addEventListener("input", function() {
  const keyword = this.value.toLowerCase().trim();
  for (let nhom in dsNV) {
    const ul = document.getElementById(nhom);
    const lis = ul.getElementsByTagName("li");
    ul.style.display = keyword ? "block" : "none";
    for (let li of lis) {
      li.style.display = li.textContent.toLowerCase().includes(keyword) ? "list-item" : "none";
    }
  }
});

ids.forEach(id => taoRadio(id));
hienThiDanhSach();
document.getElementById("ngay").innerText = "Tháng: " + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
