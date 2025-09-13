const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Serve static files from the main Complaint-project folder (frontend)
app.use(express.static(path.join(__dirname, '..')));


// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/admindashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admindashboard.html'));
});
app.get('/adminRegisteration', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'adminRegisteration.html'));
});
app.get('/complaintform', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'complaintform.html'));
});
app.get('/registeration', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'registeration.html'));
});




// Use SQLite database
const db = require('./db');

// Handle admin dashboard actions (e.g., get all complaints)

// GET all complaints for admin dashboard
app.get('/api/complaints', (req, res) => {
  db.all('SELECT * FROM complaints', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});


// Unified registration for both admin and user
app.post('/api/register', (req, res) => {
  const { firstname, lastname, regno, username, password, email, role } = req.body;
  if (!firstname || !lastname || !regno || !username || !password || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (row) {
      return res.status(400).json({ error: 'User already registered with this email.' });
    }
    db.run('INSERT INTO users (firstname, lastname, regno, username, password, email, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstname, lastname, regno, username, password, email, role], function(err) {
      if (err) return res.status(400).json({ error: 'Registration failed.' });
      res.json({ message: 'User registered successfully', user: { firstname, lastname, regno, username, email, role } });
    });
  });
});

// Login endpoint: checks if user is registered and returns role
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (user) {
      // Return the user's role so the frontend can redirect accordingly
      return res.json({ success: true, role: user.role, username: user.username, email: user.email });
    }
    return res.json({ success: false });
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



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
