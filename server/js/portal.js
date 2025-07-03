// NEVER86 Full Application Logic
// =============================================

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentOrder = null; // Active order in session
let selectedTable = null;

// Save all orders back to localStorage
function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

// Utility: find order by ID
function findOrderById(orderId) {
  return orders.find(order => order.id === orderId);
}

// Utility: check if table is occupied
function isTableOccupied(tableNumber) {
  return orders.some(order => order.tableNumber === tableNumber && order.status !== 'Closed');
}

// ======== New Table Logic ========
function selectTable(tableNumber) {
  console.log(`Clicked Table: ${tableNumber}`); // Debug click

  if (isTableOccupied(tableNumber)) {
    alert(`Table ${tableNumber} is already occupied!`);
    return;
  }
  selectedTable = tableNumber;
  document.getElementById('guest-setup').style.display = 'block';
  document.getElementById('table-grid').style.display = 'none';
  console.log(`Table ${tableNumber} selected and guest setup shown`);
}
