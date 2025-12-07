const ids = [
    "sang2", "sang3", "sang4", "sang5", "sang6", "sang7", "sangCN",
    "chieu2", "chieu3", "chieu4", "chieu5", "chieu6", "chieu7", "chieuCN",
    "toi2", "toi3", "toi4", "toi5", "toi6", "toi7", "toiCN",
];

// Cấu trúc dsNV đã thay đổi: lưu đối tượng { ten, sdt }
let dsNV = JSON.parse(localStorage.getItem("dsNV")) || {
    ql: [
  
    ],
    pv: [
        
    ],
    tn: [
     
    ],
};
let lichNV = JSON.parse(localStorage.getItem("lichNV")) || {};
let Xoa = false;
let nhanVienHienTai = "";

const nhomToChucVu = {
    ql: "Quản Lý",
    pv: "Phục Vụ",
    tn: "Thu Ngân"
};

/* =======================================================
   1. CÁC HÀM XỬ LÝ LỊCH VÀ NHÂN VIÊN
========================================================= */

function taoCheckbox(id, giaTri = "Không") {
    const td = document.getElementById(id);
    if (!td) return;
    
    const isChecked = giaTri === "Có" ? "checked" : "";
    td.innerHTML = `<input type="checkbox" id="check-${id}" ${isChecked}>`;
    td.classList.remove("checked");
    td.style.fontSize = "14px";
    td.style.fontWeight = "normal";

    const checkboxElement = document.getElementById(`check-${id}`);
    if (checkboxElement) {
        checkboxElement.onchange = () => capNhatNhanh(id);
    }
}
function hienThi(id) {
    const list = document.getElementById(id);
    const searchInput = document.getElementById("search");
    if (searchInput.value.trim() !== "") {
        return;
    }
    list.style.display =
        list.style.display === "none" || list.style.display === ""
            ? "block"
            : "none";
}
function capNhatNhanh(id) {
    if (!nhanVienHienTai) return alert("⚠ Hãy chọn nhân viên trước!");
    const checkbox = document.getElementById(`check-${id}`);
    const giaTriMoi = checkbox.checked ? "Có" : "Không";
    
    // Đảm bảo lịch NV tồn tại
    if (!lichNV[nhanVienHienTai]) {
        lichNV[nhanVienHienTai] = {};
        ids.forEach((i) => (lichNV[nhanVienHienTai][i] = "Không"));
    }

    lichNV[nhanVienHienTai][id] = giaTriMoi;
    localStorage.setItem("lichNV", JSON.stringify(lichNV));

    const cell = document.getElementById(id);
    cell.style.transition = "none";
    cell.style.backgroundColor = giaTriMoi === "Có" ? "#2ecc71" : "#e74c3c"; // Màu đỏ cho "Không"
    setTimeout(() => {
        cell.style.transition = "background-color 0.2s";
        cell.style.backgroundColor = "#444"; // Quay về màu nền tối
    }, 100);
}

function capNhat() {
    localStorage.setItem("lichNV", JSON.stringify(lichNV));
    alert("💾 Đã lưu lịch (được cập nhật tự động) cho " + nhanVienHienTai);
}

function resetLuaChon() {
    if (!nhanVienHienTai) return;
    
    if (!lichNV[nhanVienHienTai]) {
        lichNV[nhanVienHienTai] = {};
        ids.forEach((id) => (lichNV[nhanVienHienTai][id] = "Không"));
        localStorage.setItem("lichNV", JSON.stringify(lichNV));
    }
    
    ids.forEach((id) => {
        const val = lichNV[nhanVienHienTai][id] || "Không";
        taoCheckbox(id, val);
    });
}

function chonNhanVien(ten) {
    nhanVienHienTai = ten;
    document.getElementById("tenNV").innerText = "Lịch làm của: " + ten;
    document.getElementById("ngay").innerText =
        "Tháng: " + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();

    if (!lichNV[ten]) {
        lichNV[ten] = {};
        ids.forEach((id) => (lichNV[ten][id] = "Không"));
    }
    resetLuaChon();
}

// Cập nhật: Hàm nhận đối tượng nhân viên (nv) thay vì chỉ tên
function createListItem(nv, nhom) { 
    const li = document.createElement("li");
    li.textContent = nv.ten;
    li.onclick = () => {
        if (Xoa) {
            if (confirm("Xóa nhân viên '" + nv.ten + "'?")) {
                // Lọc bỏ đối tượng có tên tương ứng
                dsNV[nhom] = dsNV[nhom].filter((item) => item.ten !== nv.ten);
                delete lichNV[nv.ten];
                localStorage.setItem("dsNV", JSON.stringify(dsNV));
                localStorage.setItem("lichNV", JSON.stringify(lichNV));
                hienThiDanhSach();
                hienThiDanhSachTongHop(); // Cập nhật danh sách tổng hợp
                if (nhanVienHienTai === nv.ten) {
                    nhanVienHienTai = "";
                    document.getElementById("tenNV").innerText = "Chưa chọn nhân viên";
                    // Xóa nội dung lịch
                    ids.forEach((id) => document.getElementById(id).innerHTML = "");
                }
            }
        } else {
            chonNhanVien(nv.ten);
        }
    };
    return li;
}

// Cập nhật: Thêm nhập Số Điện Thoại (sdt)
function themNhanVien() {
    const nhom = prompt("Thêm vào nhóm nào? (ql/pv/tn): ");
    if (!nhom || !dsNV.hasOwnProperty(nhom)) {
        return alert("❌ Nhóm không hợp lệ (phải là ql, pv, tn).");
    }
    const ten = prompt("Nhập tên nhân viên:");
    if (!ten) {
         return alert("❌ Tên nhân viên không được để trống.");
    }
    const sdt = prompt("Nhập số điện thoại (Không bắt buộc):"); // <-- THÊM SĐT
    
    // Kiểm tra trùng lặp tên
    if (dsNV[nhom].some(nv => nv.ten === ten)) {
        return alert("❌ Nhân viên này đã tồn tại.");
    }
    
    // Tạo đối tượng nhân viên mới
    const newEmployee = {
        ten: ten,
        sdt: sdt || "Đang cập nhật" 
    };
    
    dsNV[nhom].push(newEmployee);
    
    // Khởi tạo lịch
    lichNV[ten] = {};
    ids.forEach((id) => (lichNV[ten][id] = "Không"));
    
    // Lưu
    localStorage.setItem("dsNV", JSON.stringify(dsNV));
    localStorage.setItem("lichNV", JSON.stringify(lichNV));

    hienThiDanhSach();
    hienThiDanhSachTongHop(); 
    alert("✅ Thêm nhân viên thành công.");
}

function xoaNhanVien() {
    Xoa = !Xoa;
    const xoaBtn = document.getElementById("xoaNV");
    xoaBtn.textContent = Xoa ? "Click tên để xóa" : "🗑️ Xóa";
    const leftPanel = document.querySelector(".left");
    if (Xoa) {
        leftPanel.classList.add("deleting");
    } else {
        leftPanel.classList.remove("deleting");
    }
}

// Cập nhật: Lặp qua đối tượng nhân viên
function hienThiDanhSach() {
    for (let nhom in dsNV) {
        const ul = document.getElementById(nhom);
        ul.innerHTML = "";
        dsNV[nhom].forEach((nv) => { 
            const li = createListItem(nv, nhom); 
            ul.appendChild(li);
        });
    }
}

/* =======================================================
   2. HÀM HIỂN THỊ DANH SÁCH TỔNG HỢP (table-body)
   (Được thêm vào để hiển thị SĐT)
========================================================= */

function hienThiDanhSachTongHop() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ""; // Xóa sạch nội dung cũ
    
    let stt = 1;
    
    for (let nhom in dsNV) {
        const chucVu = nhomToChucVu[nhom];
        
        dsNV[nhom].forEach((nv) => { 
            const row = document.createElement('tr');
            
            // STT
            const sttCell = document.createElement('td');
            sttCell.textContent = stt++;
            row.appendChild(sttCell);

            // Tên Nhân Viên
            const nameCell = document.createElement('td');
            nameCell.textContent = nv.ten; 
            row.appendChild(nameCell);
            
            // Chức Vụ
            const positionCell = document.createElement('td');
            positionCell.textContent = chucVu;
            row.appendChild(positionCell);
            
            // Số Điện Thoại
            const phoneCell = document.createElement('td');
            phoneCell.textContent = nv.sdt; 
            row.appendChild(phoneCell);
            
            tableBody.appendChild(row);
        });
    }
}


/* =======================================================
   3. KHỞI TẠO VÀ SỰ KIỆN
========================================================= */

document.getElementById("search").addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    for (let nhom in dsNV) {
        const ul = document.getElementById(nhom);
        const h3 = ul.previousElementSibling;
        const lis = ul.getElementsByTagName("li");
        let found = false;
        
        for (let li of lis) {
            if (li.textContent.toLowerCase().includes(keyword)) {
                li.style.display = "list-item";
                found = true;
            } else {
                li.style.display = "none";
            }
        }
        
        if (keyword === "") {
            ul.style.display = "none";
            h3.style.display = "block";
        } else {
            ul.style.display = found ? "block" : "none";
            h3.style.display = found ? "block" : "none";
        }
    }
});

hienThiDanhSach();
hienThiDanhSachTongHop(); // Gọi hàm này khi khởi tạo để điền dữ liệu vào bảng tổng hợp

ids.forEach((id) => {
    const cell = document.getElementById(id);
    if(cell) cell.innerHTML = "";
});

document.getElementById("ngay").innerText =
    "Tháng: " + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();