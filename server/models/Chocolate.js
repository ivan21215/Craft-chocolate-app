const mongoose = require('mongoose');

const chocolateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  type: { type: String, required: true, enum: ['dark', 'milk', 'white'] },
  filling: {
    type: String,
    enum: ['none', 'strawberry', 'cookie', 'hazelnut', 'almond', 'caramel', 'orange', 'mint', 'sea salt'],
    default: 'none'
  },
  cocoaPercentage: { type: Number, min: 0, max: 100 },
  price: { type: Number, required: true, min: 0 },
  weight: { type: Number, min: 0 },
  color: { type: String, trim: true },
  description: { type: String, trim: true },
  imageUrl: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Chocolate', chocolateSchema);
