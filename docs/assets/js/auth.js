document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('errorMessage').innerText = data.message || 'Login failed.';
    }
  } catch (err) {
    console.error('Login error:', err);
    document.getElementById('errorMessage').innerText = 'Server error.';
  }
});

