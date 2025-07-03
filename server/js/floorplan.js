function handleTableClick(tableNumber) {
  const order = orders.find(o => o.tableNumber === tableNumber && o.status !== 'Closed');
  if (order) {
    window.location.href = `order_dashboard.html?order=${order.id}`;
  } else {
    alert(`Table ${tableNumber} is not currently active.`);
  }
}
function renderFloorPlan() {
  const grid = document.getElementById('table-grid');
  const buttons = grid.querySelectorAll('button');

  buttons.forEach(btn => {
    const tableNum = parseInt(btn.textContent.replace('Table ', ''));
    
    if (isTableOccupied(tableNum)) {
      btn.style.backgroundColor = '#007bff'; // Royal Blue
      btn.style.color = '#fff';
    } else {
      btn.style.backgroundColor = '#cce7ff'; // Light Blue
      btn.style.color = '#000';
    }
  });
}

// Render table colors on load
window.addEventListener('DOMContentLoaded', () => {
  renderFloorPlan();
});
