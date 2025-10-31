function toggleForm() {
  const form = document.getElementById('addForm');
  if (form.style.display === '' || form.style.display === 'none') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}

function deleteItem(btn) {
  btn.parentElement.remove();
}

document.getElementById('addButton').addEventListener('click', () => {
  const name = document.getElementById('foodName').value.trim();
  const price = document.getElementById('foodPrice').value.trim();
  const img = document.getElementById('foodImg').value.trim();
  const type = document.getElementById('foodType').value;

  if (!name || !price || !img) {
    alert('Vui lòng nhập đủ thông tin!');
    return;
  }

  const newItem = document.createElement('div');
  newItem.classList.add('menu-item');
  newItem.innerHTML = `
    <button class="delete-btn" onclick="deleteItem(this)">×</button>
    <img src="${img}" alt="${name}">
    <h3>${name}</h3>
    <p>Giá: ${parseInt(price).toLocaleString('vi-VN')}đ</p>
    <button class="order-btn" onclick="openOrderPopup('${name}')">Order</button>
  `;

  if (type === 'food') {
    document.getElementById('foodContainer').appendChild(newItem);
  } else {
    document.getElementById('drinkContainer').appendChild(newItem);
  }

  document.getElementById('foodName').value = '';
  document.getElementById('foodPrice').value = '';
  document.getElementById('foodImg').value = '';
  document.getElementById('foodType').value = 'food';
  form.style.display = 'none';
});

let currentItem = null;

function openOrderPopup(itemName) {
  currentItem = itemName;
  document.getElementById('orderItemName').textContent = `Gọi món: ${itemName}`;
  document.getElementById('orderPopup').style.display = 'flex';
}

function closeOrderPopup() {
  document.getElementById('orderPopup').style.display = 'none';
  document.getElementById('tableNumber').value = '';
}

function confirmOrder() {
  const table = document.getElementById('tableNumber').value.trim();
  if (!table) {
    alert('Vui lòng nhập số bàn!');
    return;
  }

  alert(`Đã order món ${currentItem} cho bàn số ${table}`);
  closeOrderPopup();
}
