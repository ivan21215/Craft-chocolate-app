const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const exists = await User.exists({ $or: [{ username }, { email: email.toLowerCase() }] });
  if (exists) return res.status(409).json({ message: 'Username or email already taken' });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ username, email, password: hashed });

  res.status(201).json({ message: 'Registration successful' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password ?? '', user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
});

module.exports = router;
