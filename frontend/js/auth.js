// REGISTER
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  const res = await apiRequest('/api/auth/register', 'POST', { email, password });

  if (res.message) {
    alert('Registered successfully');
  } else {
    alert(res.error || 'Registration failed');
  }
});

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await apiRequest('/api/auth/login', 'POST', { email, password });

  if (res.token) {
    localStorage.setItem('token', res.token);
    window.location.href = 'notes.html';
  } else {
    alert('Login failed');
  }
});
