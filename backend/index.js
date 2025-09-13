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
app.get('/try', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'try.html'));
});



// In-memory storage for demonstration (replace with DB later)
const admins = [];
const users = [];
const complaints = [
  { id: 1, user: 'user1', title: 'Network Issue', description: 'Internet not working', status: 'Pending' },
  { id: 2, user: 'user2', title: 'Broken Chair', description: 'Chair in room 101 is broken', status: 'Resolved' }
];

// Handle admin dashboard actions (e.g., get all complaints)

// GET all complaints for admin dashboard
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

// Handle admin registration form submission
app.post('/api/adminRegisteration', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  admins.push({ username, password, email });
  res.json({ message: 'Admin registered successfully', admin: { username, email } });
});

// Login endpoint: checks if user is registered and returns role
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Check admin
  const admin = admins.find(a => (a.username === username || a.email === username) && a.password === password);
  if (admin) {
    return res.json({ success: true, role: 'admin', username: admin.username });
  }
  // Check user
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  if (user) {
    return res.json({ success: true, role: 'user', username: user.username });
  }
  // Not registered
  return res.json({ success: false });
});

// Handle complaint form submission
app.post('/api/complaintform', (req, res) => {
  const { name, matric, email, department, title, details, status } = req.body;
  if (!name || !matric || !email || !department || !title || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const complaint = {
    id: complaints.length > 0 ? complaints[complaints.length - 1].id + 1 : 1,
    name,
    matric,
    email,
    department,
    title,
    details,
    status: status || 'Pending',
    date: new Date()
  };
  complaints.push(complaint);
  res.json({ message: 'Complaint submitted successfully', complaint });
});

// Handle user registration form submission
app.post('/api/registeration', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  users.push({ username, password, email });
  res.json({ message: 'User registered successfully', user: { username, email } });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
