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
