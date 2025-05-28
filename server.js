const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const usersPath = path.resolve(__dirname, 'users.json');
const transactionsPath = path.resolve(__dirname, 'transactions.json');
const loginLogPath = path.join(__dirname, 'login_attempts.log');

console.log('Using users.json at:', usersPath);
console.log('Using transactions.json at:', transactionsPath);

// Trust proxy to get real IPs behind Nginx/Cloudflare
app.set('trust proxy', true);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'docs')));

// Login API with logging of all login attempts
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    const user = users.find(u => u.email === email && u.password === password);

    const logEntry = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      email,
      status: user ? 'success' : 'failed',
      reason: user ? 'Authenticated' : 'Invalid credentials'
    };

    // Print to console (optional for debug)
    console.log(`[LOGIN ATTEMPT] ${JSON.stringify(logEntry)}`);

    // Append to login_attempts.log
    fs.appendFile(loginLogPath, JSON.stringify(logEntry) + '\n', err => {
      if (err) console.error('Error writing login attempt to log file:', err);
    });

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Transfer API
app.post('/api/transfer', (req, res) => {
  try {
    const { senderEmail, receiverEmail, amount } = req.body;
    let users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    let transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf-8'));

    const sender = users.find(u => u.email === senderEmail);
    const receiver = users.find(u => u.email === receiverEmail);

    if (!sender || !receiver || sender.balance < amount) {
      return res.status(400).json({ success: false, message: 'Invalid transaction' });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    const transaction = {
      sender: sender.name,
      receiver: receiver.name,
      amount,
      timestamp: new Date().toISOString()
    };

    transactions.push(transaction);

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2));

    res.json({ success: true, user: sender });
  } catch (err) {
    console.error('Transfer error:', err.message);
    res.status(500).json({ success: false, message: 'Server error during transfer' });
  }
});

// Transactions API
app.get('/api/transactions', (req, res) => {
  try {
    const transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf-8'));
    res.json(transactions);
  } catch (err) {
    console.error('Transaction retrieval error:', err.message);
    res.status(500).json({ success: false, message: 'Server error fetching transactions' });
  }
});

// GET all users
app.get('/api/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
