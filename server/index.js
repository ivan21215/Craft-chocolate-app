require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const manufacturerRoutes = require('./routes/manufacturers');
const chocolateRoutes = require('./routes/chocolates');
const authRoutes = require('./routes/auth');
const meRoutes = require('./routes/me');
const userRoutes = require('./routes/users');
const { verifyToken, requireAdmin } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/manufacturers', verifyToken, manufacturerRoutes);
app.use('/api/chocolates', verifyToken, chocolateRoutes);
app.use('/api/me', verifyToken, meRoutes);
app.use('/api/users', verifyToken, requireAdmin, userRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.code === 11000) return res.status(409).json({ message: 'Username or email already taken' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
