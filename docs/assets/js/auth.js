// Example users hardcoded here
const users = [
  {
    email: "farida@netsanctum.com",
    password: "try@h@ckm3!",
    name: "Farida",
    role: "admin",
    balance: 10000
  },
  {
    email: "ironman@avengers.com",
    password: "iamironman",
    name: "Tony Stark",
    role: "user",
    balance: 5000
  },
  {
    email: "spiderman@avengers.com",
    password: "withgreatpower",
    name: "Peter Parker",
    role: "user",
    balance: 3000
  },
  {
    email: "natasha@avengers.com",
    password: "blackwidow",
    name: "Natasha Romanoff",
    role: "user",
    balance: 4000
  },
  {
    email: "cap@avengers.com",
    password: "freedom",
    name: "Steve Rogers",
    role: "user",
    balance: 4500
  },
  {
    email: "thor@asgard.com",
    password: "godofthunder",
    name: "Thor Odinson",
    role: "user",
    balance: 6000
  }
];

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('errorMessage').innerText = 'Invalid email or password.';
  }
});
