// Gắn sự kiện cho từng bàn có sẵn
document.querySelectorAll('.table-box').forEach(setupTable);

// Hàm xử lý 1 bàn
function setupTable(table) {
  const openBtn = table.querySelector('.btn-mo');
  const calcBtn = table.querySelector('.btn-tinh');
  const deleteBtn = table.querySelector('.btn-xoa');
  const timerDisplay = table.querySelector('.timer');

  let startTime = null;
  let interval = null;

  // Mở bàn
  openBtn.addEventListener('click', () => {
    if (interval) return;
    startTime = Date.now();
    table.classList.add('dangchoi');
    interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const h = Math.floor(elapsed / 3600000);
      const m = Math.floor((elapsed % 3600000) / 60000);
      const s = Math.floor((elapsed % 60000) / 1000);
      timerDisplay.textContent =
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
  });

  // Tính tiền
  calcBtn.addEventListener('click', () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      table.classList.remove('dangchoi');
      const totalTime = timerDisplay.textContent;
      alert(`⏱ Tổng thời gian chơi của ${table.querySelector('h3').textContent}: ${totalTime}`);
      timerDisplay.textContent = '00:00:00';
    }
  });

  // Xoá bàn
  deleteBtn.addEventListener('click', () => {
    if (confirm(`Bạn có chắc muốn xoá ${table.querySelector('h3').textContent}?`)) {
      table.remove();
    }
  });
}

// Nút thêm bàn
document.querySelectorAll('.add-box').forEach(addBtn => {
  addBtn.addEventListener('click', () => {
    const container = addBtn.parentElement;
    const tableCount = container.querySelectorAll('.table-box').length + 1;

    const newTable = document.createElement('div');
    newTable.className = 'table-box trong';
    newTable.innerHTML = `
      <div class="table-header">
        <h3>Bàn ${tableCount}</h3>
        <button class="btn-xoa">❌</button>
      </div>
      <button class="btn btn-mo">Mở bàn</button>
      <button class="btn btn-tinh">Tính tiền</button>
      <div class="timer">00:00:00</div>
    `;

    container.insertBefore(newTable, addBtn);
    setupTable(newTable);
  });
});
