const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chocolate' }],
  cart: [{
    _id: false,
    chocolate: { type: mongoose.Schema.Types.ObjectId, ref: 'Chocolate', required: true },
    quantity: { type: Number, min: 1, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
