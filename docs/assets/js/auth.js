document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('errorMessage').innerText = data.message || 'Invalid email or password.';
    }
  } catch (error) {
    console.error('Login error:', error);
    document.getElementById('errorMessage').innerText = 'Server error. Please try again.';
  }
});


