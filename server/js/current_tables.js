function renderCurrentOrders() {
  const activeContainer = document.getElementById('current-orders');
  const previousContainer = document.getElementById('previous-orders');

  activeContainer.innerHTML = '';
  previousContainer.innerHTML = '';

  let hasActiveOrders = false;
  let hasPreviousOrders = false;

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h4>Table ${order.tableNumber}</h4>
      <p>Status: ${order.status}</p>
      <p>Total: $${order.total.toFixed(2)}</p>
    `;

    if (order.status !== 'Closed' && order.status !== 'Seated') {
      activeContainer.appendChild(card);
      hasActiveOrders = true;
    } else if (order.status === 'Closed') {
      const billedTime = order.timestamps.billed
        ? new Date(order.timestamps.billed).toLocaleTimeString()
        : 'N/A';
      card.innerHTML += `<p>Billed Out: ${billedTime}</p>`;
      previousContainer.appendChild(card);
      hasPreviousOrders = true;
    }
  });

  // Show empty state boxes if no orders
  if (!hasActiveOrders) {
    activeContainer.innerHTML = `
      <div class="empty-box">
        <h3>Current Tables</h3>
        <p>You have no current tables, go ask your manager for shit to do.</p>
      </div>
    `;
  }
  if (!hasPreviousOrders) {
    previousContainer.innerHTML = `
      <div class="empty-box">
        <h3>Previous Tables</h3>
        <p>You have no previous tables, check back later.</p>
      </div>
    `;
  }
}

// Render on page load
window.addEventListener('DOMContentLoaded', renderCurrentOrders);
