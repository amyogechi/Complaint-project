const db = require('./db');

db.all('SELECT id, username, email, role FROM users', [], (err, rows) => {
  if (err) {
    console.error('Error fetching users:', err);
    process.exit(1);
  }
  console.log('Registered users:');
  rows.forEach(row => {
    console.log(row);
  });
  process.exit(0);
});
