const express = require('express');
const User = require('../models/User');
const Chocolate = require('../models/Chocolate');

const router = express.Router();

router.use(async (req, res, next) => {
  if (!(await User.exists({ _id: req.user.id }))) {
    return res.status(401).json({ message: 'User no longer exists' });
  }
  next();
});

const withManufacturer = { path: 'manufacturer', select: 'name' };

async function getCart(userId) {
  const user = await User.findById(userId).populate({ path: 'cart.chocolate', populate: withManufacturer });
  return user.cart.filter(item => item.chocolate);
}

async function getFavorites(userId) {
  const user = await User.findById(userId).populate({ path: 'favorites', populate: withManufacturer });
  return user.favorites.filter(Boolean);
}

router.get('/cart', async (req, res) => {
  res.json(await getCart(req.user.id));
});

router.post('/cart', async (req, res) => {
  const { chocolateId } = req.body;
  if (!(await Chocolate.exists({ _id: chocolateId }))) {
    return res.status(404).json({ message: 'Chocolate not found' });
  }

  const user = await User.findById(req.user.id);
  const item = user.cart.find(i => i.chocolate.equals(chocolateId));
  if (item) item.quantity += 1;
  else user.cart.push({ chocolate: chocolateId });
  await user.save();

  res.json(await getCart(req.user.id));
});

router.put('/cart/:chocolateId', async (req, res) => {
  const user = await User.findById(req.user.id);
  const item = user.cart.find(i => i.chocolate.equals(req.params.chocolateId));
  if (!item) return res.status(404).json({ message: 'Chocolate is not in the cart' });

  item.quantity = req.body.quantity;
  await user.save();

  res.json(await getCart(req.user.id));
});

router.delete('/cart/:chocolateId', async (req, res) => {
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter(i => !i.chocolate.equals(req.params.chocolateId));
  await user.save();

  res.json(await getCart(req.user.id));
});

router.post('/cart/checkout', async (req, res) => {
  const cart = await getCart(req.user.id);
  if (cart.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  await User.updateOne({ _id: req.user.id }, { $set: { cart: [] } });
  res.json({ message: 'Order placed' });
});

router.get('/favorites', async (req, res) => {
  res.json(await getFavorites(req.user.id));
});

router.post('/favorites/:chocolateId', async (req, res) => {
  if (!(await Chocolate.exists({ _id: req.params.chocolateId }))) {
    return res.status(404).json({ message: 'Chocolate not found' });
  }
  await User.updateOne({ _id: req.user.id }, { $addToSet: { favorites: req.params.chocolateId } });
  res.json(await getFavorites(req.user.id));
});

router.delete('/favorites/:chocolateId', async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $pull: { favorites: req.params.chocolateId } });
  res.json(await getFavorites(req.user.id));
});

module.exports = router;
