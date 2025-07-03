function startOrder() {
  const guestCountValue = document.getElementById('guest-count').value;
  const guestCount = guestCountValue === 'large' ? 12 : parseInt(guestCountValue);

  currentOrder = {
    id: crypto.randomUUID(),
    tableNumber: selectedTable,
    serverName: 'LoggedInServer', // placeholder for now
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

  // 🚀 Redirect to the order dashboard
  window.location.href = `order_dashboard.html?order=${currentOrder.id}`;
}
