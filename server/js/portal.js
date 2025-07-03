// NEVER86 Full Application Logic
// =============================================

// Orders stored globally and persisted in localStorage
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

// Called when user clicks a table
function selectTable(tableNumber) {
  if (isTableOccupied(tableNumber)) {
    alert(`Table ${tableNumber} is already occupied!`);
    return;
  }
  selectedTable = tableNumber;
  document.getElementById('guest-setup').style.display = 'block';
  document.getElementById('table-grid').style.display = 'none';
  console.log(`Table ${tableNumber} selected`);
}

// Start a new order with guest count
function startOrder() {
  const guestCountValue = document.getElementById('guest-count').value;
  const guestCount = guestCountValue === 'large' ? 12 : parseInt(guestCountValue);

  currentOrder = {
    id: crypto.randomUUID(),
    tableNumber: selectedTable,
    serverName: 'LoggedInServer', // Placeholder for future login integration
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

  document.getElementById('guest-setup').style.display = 'none';
  document.getElementById('order-section').style.display = 'block';
  buildGuestTabs(currentOrder.guests);
}

// Build guest tabs
function buildGuestTabs(guests) {
  const guestTabs = document.getElementById('guest-tabs');
  guestTabs.innerHTML = '';
  guests.forEach(guest => {
    const tab = document.createElement('button');
    tab.className = 'button';
    tab.textContent = guest.name;
    tab.onclick = () => showGuestOrder(guest.id);
    guestTabs.appendChild(tab);
  });
  showGuestOrder(guests[0].id);
}

// Show order bar for selected guest
function showGuestOrder(guestId) {
  const guest = currentOrder.guests.find(g => g.id === guestId);
  const orderBar = document.getElementById('order-bar');
  orderBar.innerHTML = `<h4>${guest.name}'s Order</h4>`;
  if (guest.items.length === 0) {
    orderBar.innerHTML += '<p>No items yet.</p>';
  } else {
    guest.items.forEach(item => {
      const line = document.createElement('div');
      line.textContent = `• ${item.name} - $${item.price.toFixed(2)}`;
      orderBar.appendChild(line);
    });
  }
}

// Send order to kitchen
function sendOrderConfirmation() {
  if (!currentOrder) return;
  const confirmSend = confirm('Are you sure this is good to send? You cannot undo this!');
  if (confirmSend) {
    currentOrder.status = 'Waiting on Drinks';
    currentOrder.timestamps.drinksSent = new Date().toISOString();
    saveOrders();
    alert('Order sent to kitchen.');
    window.location.href = 'index.html';
  }
}

// ======== Floor Plan Logic ========
function renderFloorPlan() {
  const grid = document.getElementById('table-grid');
  const buttons = grid.querySelectorAll('button');
  buttons.forEach(btn => {
    const tableNum = parseInt(btn.textContent.replace('Table ', ''));
    if (isTableOccupied(tableNum)) {
      btn.style.backgroundColor = '#007bff';
      btn.disabled = true;
    } else {
      btn.style.backgroundColor = '';
      btn.disabled = false;
    }
  });
}

// ======== Current Orders Logic ========
function renderCurrentOrders() {
  const container = document.getElementById('current-orders');
  container.innerHTML = '';
  orders.forEach(order => {
    if (order.status !== 'Closed') {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h4>Table ${order.tableNumber}</h4><p>Status: ${order.status}</p><p>Total: $${order.total.toFixed(2)}</p><button class=\"button\" onclick=\"advanceOrderStatus('${order.id}')\">Advance Status</button>`;
      container.appendChild(card);
    }
  });
}

// Advance order status
function advanceOrderStatus(orderId) {
  const order = findOrderById(orderId);
  if (!order) return;

  if (order.status === 'Waiting on Drinks') {
    order.status = 'Waiting on Food';
    order.timestamps.drinksSent = new Date().toISOString();
  } else if (order.status === 'Waiting on Food') {
    order.status = 'All Items Delivered';
    order.timestamps.foodSent = new Date().toISOString();
  } else if (order.status === 'All Items Delivered') {
    order.status = 'Closed';
    order.timestamps.billed = new Date().toISOString();
  }
  saveOrders();
  renderCurrentOrders();
}
