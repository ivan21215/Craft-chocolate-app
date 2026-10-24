const express = require('express');
const Manufacturer = require('../models/Manufacturer');
const Chocolate = require('../models/Chocolate');

const router = express.Router();

router.get('/', async (req, res) => {
  const manufacturers = await Manufacturer.find().sort({ name: 1 });
  res.json(manufacturers);
});

router.get('/:id', async (req, res) => {
  const manufacturer = await Manufacturer.findById(req.params.id);
  if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });

  const chocolates = await Chocolate.find({ manufacturer: manufacturer._id }).sort({ name: 1 });
  res.json({ ...manufacturer.toObject(), chocolates });
});

router.post('/', async (req, res) => {
  const manufacturer = await Manufacturer.create(req.body);
  res.status(201).json(manufacturer);
});

router.put('/:id', async (req, res) => {
  const manufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
  res.json(manufacturer);
});

router.delete('/:id', async (req, res) => {
  const count = await Chocolate.countDocuments({ manufacturer: req.params.id });
  if (count > 0) {
    return res.status(400).json({
      message: `Cannot delete manufacturer: ${count} chocolate(s) still linked to it`
    });
  }

  const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
  if (!manufacturer) return res.status(404).json({ message: 'Manufacturer not found' });
  res.json({ message: 'Manufacturer deleted' });
});

module.exports = router;
