const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().select('username email role createdAt').sort({ username: 1 });
  res.json(users);
});

router.put('/:id/role', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot change your own role' });
  }

  const user = await User.findById(req.params.id).select('username email role createdAt');
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = req.body.role;
  await user.save();
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  const { deletedCount } = await User.deleteOne({ _id: req.params.id });
  if (deletedCount === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

module.exports = router;
