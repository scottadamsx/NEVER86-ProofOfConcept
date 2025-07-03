// order_dashboard.js - Handles Order Dashboard logic

let activeOrder = null;     // Stores the current active order
let activeGuestId = null;   // Tracks the currently selected guest

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
  // Populate dashboard
  document.getElementById('table-number').textContent = activeOrder.tableNumber;
  document.getElementById('table-total').textContent = activeOrder.total.toFixed(2);
  document.getElementById('time-seated').textContent = new Date(activeOrder.timestamps.seated).toLocaleTimeString();
  document.getElementById('server-rating').textContent = 'N/A'; // Placeholder for future ratings

  // Build guest tabs
  buildGuestTabs(activeOrder.guests);
}

// ======== Build Guest Tabs ========
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

  // Show first guest's order by default
  showGuestOrder(guests[0].id);
}

// ======== Show Guest's Order Bar ========
function showGuestOrder(guestId) {
  activeGuestId = guestId;
  const guest = activeOrder.guests.find(g => g.id === guestId);
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

// ======== Add Item to Active Guest ========
function addItemToActiveGuest(name, price) {
  const guest = activeOrder.guests.find(g => g.id === activeGuestId);
  guest.items.push({ name: name, price: price });
  activeOrder.total += price;
  saveOrders();
  document.getElementById('table-total').textContent = activeOrder.total.toFixed(2);
  showGuestOrder(activeGuestId);
}

// ======== Send Order ========
function sendOrder() {
  if (activeOrder.status === 'Seated') {
    const confirmSend = confirm('Are you sure you want to send this order to the kitchen? You cannot undo this.');
    if (confirmSend) {
      activeOrder.status = 'Waiting on Drinks';
      activeOrder.timestamps.drinksSent = new Date().toISOString();
      saveOrders();
      alert('Order sent to kitchen.');
    }
  } else {
    alert('Order has already been sent.');
  }
}

// ======== Bill Out ========
function billOut() {
  document.getElementById('modal-total').textContent = activeOrder.total.toFixed(2);
  document.getElementById('billOutModal').style.display = 'block';
}

function closeBillOutModal() {
  document.getElementById('billOutModal').style.display = 'none';
}

document.getElementById('payButton').addEventListener('click', () => {
  activeOrder.status = 'Closed';
  activeOrder.timestamps.billed = new Date().toISOString();
  saveOrders();
  alert('Table billed out successfully!');
  window.location.href = 'current_tables.html'; // Redirect back to Current Orders
});
