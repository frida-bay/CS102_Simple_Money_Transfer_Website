const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Correct absolute paths for your JSON files
const usersPath = path.join(__dirname, 'users.json');
const transactionsPath = path.join(__dirname, 'transactions.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'docs'))); // not public anymore!

// Login (use absolute path)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const fakeUsers = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  const user = fakeUsers.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Transfer money (also uses absolute path)
app.post('/api/transfer', (req, res) => {
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
});

// Get transaction history
app.get('/api/transactions', (req, res) => {
  const transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf-8'));
  res.json(transactions);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
