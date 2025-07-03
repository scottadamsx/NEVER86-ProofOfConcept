// order_dashboard.js - Handles Order Dashboard logic

let activeOrder = null; // Stores the current active order
let activeGuestId = null; // Tracks the currently selected guest

// ======== Initialization ========

// Get orderId from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get('order');

// Find the order in orders[]
activeOrder = findOrderById(orderId);

// Validate
if (!activeOrder || activeOrder.status === 'Closed') {
  alert('Invalid or inactive table. Redirecting...');
  window.location.href = 'index.html';
} else {
  // Ensure pendingItems array exists for each guest
  activeOrder.guests.forEach(g => {
    if (!g.pendingItems) g.pendingItems = [];
  });
  
  // Always select the first guest by default
  activeGuestId = activeOrder.guests[0].id;

  document.getElementById('table-number').textContent = activeOrder.tableNumber;
  document.getElementById('table-total').textContent = activeOrder.total.toFixed(2);
  document.getElementById('time-seated').textContent = new Date(activeOrder.timestamps.seated).toLocaleTimeString();
  document.getElementById('server-rating').textContent = 'N/A';
  buildGuestTabs(activeOrder.guests);
  renderGuestOrder();
}

// ======== Build Guest Tabs ========
function buildGuestTabs(guests) {
  const guestTabs = document.getElementById('guest-tabs');
  guestTabs.innerHTML = '';

  guests.forEach(guest => {
    const tab = document.createElement('div');
    tab.className = 'pill-tab' + (guest.id === activeGuestId ? ' active' : '');
    tab.textContent = guest.name;
    tab.onclick = () => switchGuest(guest.id);
    guestTabs.appendChild(tab);
  });
}

function switchGuest(guestId) {
  activeGuestId = guestId;
  buildGuestTabs(activeOrder.guests);
  renderGuestOrder();
}

// ======== Render Guest Orders ========
function renderGuestOrder() {
  const guest = activeOrder.guests.find(g => g.id === activeGuestId);
  const orderBar = document.getElementById('order-bar');
  orderBar.innerHTML = `<h4>${guest.name}'s Order</h4>`;

  guest.items.forEach(item => {
    orderBar.innerHTML += `<div class="order-item committed">${item.name} - $${item.price.toFixed(2)} <button class="void" onclick="voidItem('${guest.id}','${item.name}')">Void</button></div>`;
  });

  guest.pendingItems.forEach(item => {
    orderBar.innerHTML += `<div class="order-item pending">${item.name} - $${item.price.toFixed(2)} <button onclick="removePendingItem('${guest.id}','${item.name}')">❌</button></div>`;
  });

  updateTotal();
}

// ======== Add/Remove Items ========
function addPendingItem(name, price) {
  const guest = activeOrder.guests.find(g => g.id === activeGuestId);
  if (!guest) {
    alert('Please select a guest before adding items.');
    return;
  }
  guest.pendingItems.push({ name, price });
  renderGuestOrder();
  saveOrders();
}

function removePendingItem(guestId, name) {
  const guest = activeOrder.guests.find(g => g.id === guestId);
  guest.pendingItems = guest.pendingItems.filter(item => item.name !== name);
  renderGuestOrder();
  saveOrders();
}

function voidItem(guestId, name) {
  const guest = activeOrder.guests.find(g => g.id === guestId);
  guest.items = guest.items.filter(item => item.name !== name);
  renderGuestOrder();
  saveOrders();
}

// ======== Send Order ========
function sendOrder() {
  activeOrder.guests.forEach(guest => {
    guest.items = guest.items.concat(guest.pendingItems);
    guest.pendingItems = [];
  });
  activeOrder.status = 'Waiting on Drinks';
  activeOrder.timestamps.drinksSent = new Date().toISOString();
  renderGuestOrder();
  saveOrders();
  alert('Pending items sent to kitchen.');
}

// ======== Bill Out ========
function billOut() {
  activeOrder.status = 'Closed';
  activeOrder.timestamps.billed = new Date().toISOString();
  saveOrders();
  alert('Table billed out successfully!');
  window.location.href = 'current_tables.html';
}

function updateTotal() {
  let total = 0;
  activeOrder.guests.forEach(g => {
    total += g.items.reduce((sum, item) => sum + item.price, 0);
    total += g.pendingItems.reduce((sum, item) => sum + item.price, 0);
  });
  activeOrder.total = total;
  document.getElementById('table-total').textContent = total.toFixed(2);
  saveOrders();
}
