// Migration script to add new columns to users table if they do not exist
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'complaints.db'));

const columns = [
  { name: 'firstname', type: 'TEXT' },
  { name: 'lastname', type: 'TEXT' },
  { name: 'regno', type: 'TEXT' }
];

function addColumnIfNotExists(column) {
  db.get(`PRAGMA table_info(users)`, (err, info) => {
    if (err) return console.error(err);
    db.all(`PRAGMA table_info(users)`, (err, rows) => {
      if (err) return console.error(err);
      const exists = rows.some(r => r.name === column.name);
      if (!exists) {
        db.run(`ALTER TABLE users ADD COLUMN ${column.name} ${column.type}`, err => {
          if (err) {
            console.error(`Failed to add column ${column.name}:`, err.message);
          } else {
            console.log(`Added column: ${column.name}`);
          }
        });
      } else {
        console.log(`Column already exists: ${column.name}`);
      }
    });
  });
}

columns.forEach(addColumnIfNotExists);

db.close(() => {
  console.log('Migration complete.');
});
