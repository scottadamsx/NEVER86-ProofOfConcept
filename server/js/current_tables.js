function renderCurrentOrders() {
  const activeContainer = document.getElementById('current-orders');
  const previousContainer = document.getElementById('previous-orders');

  activeContainer.innerHTML = '';
  previousContainer.innerHTML = '';

  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'card';

    // Common fields
    card.innerHTML = `
      <h4>Table ${order.tableNumber}</h4>
      <p>Status: ${order.status}</p>
      <p>Total: $${order.total.toFixed(2)}</p>
    `;

    if (order.status !== 'Closed' && order.status !== 'Seated') {
      // Only show active orders that have been sent
      activeContainer.appendChild(card);
    } else if (order.status === 'Closed') {
      // Add time billed out for previous orders
      const billedTime = order.timestamps.billed
        ? new Date(order.timestamps.billed).toLocaleTimeString()
        : 'N/A';
      card.innerHTML += `<p>Billed Out: ${billedTime}</p>`;
      previousContainer.appendChild(card);
    }
  });
}

// Render on page load
window.addEventListener('DOMContentLoaded', renderCurrentOrders);
