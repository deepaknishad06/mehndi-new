const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'mehndiSecretKeyDemo123';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$ShpiKRAv3zDc.RK.Uqo6Heey5dA0Ok6pUvi6tEsJnSpQwcsu9AVIa'; // bcrypt('priya123')

const db = new sqlite3.Database(path.resolve(__dirname, 'mehndi.sqlite'), (err) => {
  if (err) {
    console.error('SQLite connection error:', err);
    process.exit(1);
  }
});

// Ensure required table exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      groupSize TEXT,
      occasion TEXT,
      totalAmount TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Missing authorization token' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  if (username !== ADMIN_USER) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = password === 'priya123'; // TEMP: plain password for testing
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '3h' });
  return res.json({ token, username });
});

app.get('/api/bookings', authMiddleware, (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY timestamp DESC', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json({ bookings: rows });
  });
});

app.post('/api/bookings', (req, res) => {
  const data = req.body;
  if (!data || !data.fullName || !data.email || !data.phone || !data.date || !data.time || !data.totalAmount) {
    return res.status(400).json({ message: 'Missing booking fields' });
  }

  const id = data.id || `BK-${Date.now()}`;
  const sql = `INSERT INTO bookings (id, fullName, email, phone, location, date, time, category, type, groupSize, occasion, totalAmount, status, timestamp)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    id,
    data.fullName,
    data.email,
    data.phone,
    data.location,
    data.date,
    data.time,
    data.category,
    data.type,
    data.groupSize || null,
    data.occasion || null,
    data.totalAmount,
    data.status || 'Pending',
    data.timestamp || new Date().toISOString()
  ], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json({ message: 'Booking saved', bookingId: id });
  });
});

app.delete('/api/bookings/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM bookings WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (this.changes === 0) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  });
});

app.patch('/api/bookings/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status || !['Pending', 'Confirmed', 'Paid', 'Failed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  db.run('UPDATE bookings SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (this.changes === 0) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Status updated' });
  });
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
  db.all('SELECT * FROM bookings', (err, rows) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    const totalRevenue = rows.reduce((sum, b) => sum + (parseInt(String(b.totalAmount).replace(/[^0-9]/g, '')) || 0), 0);
    const pending = rows.filter(b => b.status === 'Pending').length;
    const customers = new Set(rows.map(b => b.email)).size;
    res.json({ totalBookings: rows.length, pendingBookings: pending, totalRevenue, totalCustomers: customers });
  });
});

app.listen(PORT, () => {
  console.log(`Mehndi backend running on http://localhost:${PORT}`);
});
