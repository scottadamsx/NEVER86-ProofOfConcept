function handleTableClick(tableNumber) {
  const order = orders.find(o => o.tableNumber === tableNumber && o.status !== 'Closed');
  if (order) {
    // Redirect to order dashboard with orderId
    window.location.href = `order_dashboard.html?order=${order.id}`;
  } else {
    alert(`Table ${tableNumber} is not currently active.`);
  }
}
