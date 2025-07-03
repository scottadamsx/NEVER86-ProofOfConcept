document.getElementById('login').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim().toLowerCase();

  if (username === 'server') {
    window.location.href = 'server/index.html';
  } else if (username === 'manager') {
    window.location.href = 'manager/index.html';
  } else if (username === 'kitchen') {
    window.location.href = 'kitchen/index.html';
  } else {
    alert('Invalid username. You can either pick "server", "kitchen", or "manager".');
  }
});
