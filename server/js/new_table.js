function renderNewTableGrid() {
  const grid = document.getElementById('table-grid');
  const buttons = grid.querySelectorAll('button');
  buttons.forEach(btn => {
    const tableNum = parseInt(btn.textContent.replace('Table ', ''));
    
    // 🔥 Ensure click handler is reapplied
    btn.onclick = () => selectTable(tableNum);

    if (isTableOccupied(tableNum)) {
      btn.style.display = 'none'; // Hide occupied tables
    } else {
      btn.style.display = 'inline-block'; // Show free tables
    }
  });
}

// Run render on page load
window.addEventListener('DOMContentLoaded', () => {
  renderNewTableGrid();
});

function startOrder() {
  const guestCountValue = document.getElementById('guest-count').value;
  const guestCount = guestCountValue === 'large' ? 12 : parseInt(guestCountValue);

  const existingOrder = orders.find(o => o.tableNumber === selectedTable && o.status !== 'Closed');
  if (existingOrder) {
    alert(`Table ${selectedTable} is already occupied!`);
    return;
  }

  currentOrder = {
    id: crypto.randomUUID(),
    tableNumber: selectedTable,
    serverName: 'LoggedInServer', // placeholder for now
    guests: [],
    status: 'Seated',
    total: 0,
    paid: false,
    timestamps: {
      created: new Date().toISOString(),
      seated: new Date().toISOString(),
      drinksSent: null,
      foodSent: null,
      billed: null
    }
  };

  for (let i = 1; i <= guestCount; i++) {
    currentOrder.guests.push({
      id: `guest-${i}`,
      name: `Guest ${i}`,
      items: []
    });
  }

  orders.push(currentOrder);
  saveOrders();

  selectedTable = null; // Clear selected table

  // Redirect to the order dashboard
  window.location.href = `order_dashboard.html?order=${currentOrder.id}`;
}
