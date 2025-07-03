// portal.js - Core Logic for NEVER86

let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentOrder = null;
let selectedTable = null;

// Save all orders back to localStorage
function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

// Find an order by ID
function findOrderById(orderId) {
  return orders.find(order => order.id === orderId);
}

// Check if table is occupied
function isTableOccupied(tableNumber) {
  return orders.some(order => order.tableNumber === tableNumber && order.status !== 'Closed');
}

// Select a table for a new order
function selectTable(tableNumber) {
  if (isTableOccupied(tableNumber)) {
    alert(`Table ${tableNumber} is already occupied!`);
    return;
  }
  selectedTable = tableNumber;
  document.getElementById('guest-setup').style.display = 'block';
  document.getElementById('table-grid').style.display = 'none';
}

// Start a new order
function startOrder() {
  const guestCountValue = document.getElementById('guest-count').value;
  const guestCount = guestCountValue === 'large' ? 12 : parseInt(guestCountValue);

  currentOrder = {
    id: crypto.randomUUID(),
    tableNumber: selectedTable,
    serverName: localStorage.getItem('userName') || 'Server',
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
      items: [],
      pendingItems: []
    });
  }

  orders.push(currentOrder);
  saveOrders();

  window.location.href = `order_dashboard.html?order=${currentOrder.id}`;
}

// Render Floor Plan with occupied/free states
function renderFloorPlan() {
  const grid = document.getElementById('table-grid');
  const buttons = grid.querySelectorAll('button');
  buttons.forEach(btn => {
    const tableNum = parseInt(btn.textContent.replace('Table ', ''));
    if (isTableOccupied(tableNum)) {
      btn.style.backgroundColor = '#007bff';
      btn.style.color = '#fff';
    } else {
      btn.style.backgroundColor = '#cce7ff';
      btn.style.color = '#000';
    }
  });
}

// Render Current Orders
function renderCurrentOrders() {
  const activeContainer = document.getElementById('current-orders');
  const previousContainer = document.getElementById('previous-orders');
  activeContainer.innerHTML = '';
  previousContainer.innerHTML = '';

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h4>Table ${order.tableNumber}</h4>
      <p>Status: ${order.status}</p>
      <p>Total: $${order.total.toFixed(2)}</p>
    `;

    if (order.status !== 'Closed') {
      activeContainer.appendChild(card);
    } else {
      previousContainer.appendChild(card);
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || '';
  const roleLabel = document.getElementById('roleLabel');
  if (roleLabel) roleLabel.textContent = userRole.charAt(0).toUpperCase() + userRole.slice(1);
});