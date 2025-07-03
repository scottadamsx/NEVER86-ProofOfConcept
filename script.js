document.getElementById('login').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim().toLowerCase();
  const name = document.getElementById('name').value.trim();

  if (!name) {
    alert('Please enter your name.');
    return;
  }

  // Save name and role to localStorage
  localStorage.setItem('userName', name);
  localStorage.setItem('userRole', username);

  if (username === 'server') {
    window.location.href = 'server/index.html';
  } else if (username === 'manager') {
    window.location.href = 'manager/index.html';
  } else if (username === 'kitchen') {
    window.location.href = 'kitchen/index.html';
  } else {
    alert('Invalid role. You can enter "server", "kitchen", or "manager".');
  }
});
