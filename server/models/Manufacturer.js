const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  foundedYear: { type: Number, min: 1500, max: new Date().getFullYear() },
  country: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  logoUrl: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Manufacturer', manufacturerSchema);
