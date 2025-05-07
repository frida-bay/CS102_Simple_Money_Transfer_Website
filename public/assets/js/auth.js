document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('errorMessage').innerText = 'Invalid email or password.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('errorMessage').innerText = 'Server error. Please try again.';
    });
  });
});
