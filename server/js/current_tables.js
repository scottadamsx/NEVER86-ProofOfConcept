function handleOpenTable(orderId) {
  const order = findOrderById(orderId);
  if (order && order.status !== 'Closed') {
    window.location.href = `order_dashboard.html?order=${order.id}`;
  } else {
    alert('This table is not active.');
  }
}
