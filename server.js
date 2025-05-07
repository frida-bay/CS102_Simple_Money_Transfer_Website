const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
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
  const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  const transactions = JSON.parse(fs.readFileSync('transactions.json', 'utf-8'));

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

  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 2));

  res.json({ success: true, message: 'Transaction successful' });
});

// API: GET TRANSACTION HISTORY
app.get('/api/transactions', (req, res) => {
  const transactions = JSON.parse(fs.readFileSync('transactions.json', 'utf-8'));
  res.json(transactions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
