const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'docs')));

// API: LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// API: TRANSFER MONEY
app.post('/api/transfer', (req, res) => {
  const { senderEmail, receiverEmail, amount } = req.body;
  const usersPath = path.join(__dirname, 'users.json');
  const transactionsPath = path.join(__dirname, 'transactions.json');

  const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf-8'));

  const sender = users.find(u => u.email === senderEmail);
  const receiver = users.find(u => u.email === receiverEmail);

  if (!sender || !receiver) {
    return res.status(400).json({ success: false, message: 'Invalid sender or receiver' });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ success: false, message: 'Insufficient balance' });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  const newTransaction = {
    sender: sender.name,
    receiver: receiver.name,
    amount,
    timestamp: new Date().toISOString()
  };

  transactions.push(newTransaction);

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2));

  res.json({ success: true, message: 'Transaction successful' });
});

// API: GET TRANSACTION HISTORY
app.get('/api/transactions', (req, res) => {
  const transactions = JSON.parse(fs.readFileSync(path.join(__dirname, 'transactions.json'), 'utf-8'));
  res.json(transactions);
});

// Catch-all to serve frontend routes for static HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
