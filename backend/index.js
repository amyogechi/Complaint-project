const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')));


// Serve main pages
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
});
app.get('/admindashboard', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'admindashboard.html'));
});
app.get('/adminRegisteration', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'adminRegisteration.html'));
});
app.get('/complaintform', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'complaintform.html'));
});
app.get('/registeration', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'public', 'registeration.html'));
});


// Use SQLite database
const db = require('./db');

// Handle admin dashboard actions (e.g., get all complaints)

// GET all complaints for admin dashboard
app.get('/api/complaints', (_, res) => {
  db.all('SELECT * FROM complaints', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Handle admin registration form submission
app.post('/api/adminRegisteration', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Check if email exists in users
  db.get('SELECT * FROM users WHERE email = ?', [email], (_, userRow) => {
    if (userRow) {
      return res.status(400).json({ error: 'Email is already registered as a student.' });
    }
    // Check if email or username exists in admins
    db.get('SELECT * FROM admins WHERE username = ? OR email = ?', [username, email], (_, adminRow) => {
      if (adminRow) {
        return res.status(400).json({ error: 'Email or username is already registered as an admin.' });
      }
      db.run('INSERT INTO admins (username, password, email) VALUES (?, ?, ?)', [username, password, email], function(err) {
        if (err) return res.status(400).json({ error: 'Admin registration failed.' });
        res.json({ message: 'Admin registered successfully', admin: { username, email } });
      });
    });
  });
});

// Login endpoint: checks if user is registered and returns role
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Check admin
  db.get('SELECT * FROM admins WHERE (username = ? OR email = ?) AND password = ?', [username, username, password], (_, admin) => {
    if (admin) {
      return res.json({ success: true, role: 'admin', username: admin.username });
    }
    // Check user
    db.get('SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?', [username, username, password], (_, user) => {
      if (user) {
        return res.json({ success: true, role: 'user', username: user.username });
      }
      // Not registered
      return res.json({ success: false });
    });
  });
});

// Handle complaint form submission
app.post('/api/complaintform', (req, res) => {
  const { name, matric, email, department, title, details, status } = req.body;
  if (!name || !matric || !email || !department || !title || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.run('INSERT INTO complaints (name, matric, email, department, title, details, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, matric, email, department, title, details, status || 'Pending', new Date().toISOString()],
    function(err) {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ message: 'Complaint submitted successfully', complaint: { id: this.lastID, name, matric, email, department, title, details, status: status || 'Pending', date: new Date().toISOString() } });
    });
});

// Handle user registration form submission
app.post('/api/registeration', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Check if email exists in admins
  db.get('SELECT * FROM admins WHERE email = ?', [email], (_, adminRow) => {
    if (adminRow) {
      return res.status(400).json({ error: 'Email is already registered as an admin.' });
    }
    // Check if email or username exists in users
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (_, userRow) => {
      if (userRow) {
        return res.status(400).json({ error: 'Email or username is already registered as a student.' });
      }
      db.run('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, 'user'], function(err) {
        if (err) return res.status(400).json({ error: 'User registration failed.' });
        res.json({ message: 'User registered successfully', user: { username, email } });
      });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// module.exports = app;
