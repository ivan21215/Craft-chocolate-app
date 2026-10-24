const express = require('express');
const Chocolate = require('../models/Chocolate');

const router = express.Router();

router.get('/', async (req, res) => {
  const chocolates = await Chocolate.find().populate('manufacturer', 'name country');

  chocolates.sort((a, b) =>
    a.manufacturer.name.localeCompare(b.manufacturer.name) || a.name.localeCompare(b.name)
  );

  res.json(chocolates);
});

router.get('/:id', async (req, res) => {
  const chocolate = await Chocolate.findById(req.params.id).populate('manufacturer');
  if (!chocolate) return res.status(404).json({ message: 'Chocolate not found' });
  res.json(chocolate);
});

router.post('/', async (req, res) => {
  const chocolate = await Chocolate.create(req.body);
  await chocolate.populate('manufacturer');
  res.status(201).json(chocolate);
});

router.put('/:id', async (req, res) => {
  const chocolate = await Chocolate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('manufacturer');
  if (!chocolate) return res.status(404).json({ message: 'Chocolate not found' });
  res.json(chocolate);
});

router.delete('/:id', async (req, res) => {
  const chocolate = await Chocolate.findByIdAndDelete(req.params.id);
  if (!chocolate) return res.status(404).json({ message: 'Chocolate not found' });
  res.json({ message: 'Chocolate deleted' });
});

module.exports = router;
