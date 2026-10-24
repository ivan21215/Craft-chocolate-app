require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const manufacturerRoutes = require('./routes/manufacturers');
const chocolateRoutes = require('./routes/chocolates');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/manufacturers', manufacturerRoutes);
app.use('/api/chocolates', chocolateRoutes);

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
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
