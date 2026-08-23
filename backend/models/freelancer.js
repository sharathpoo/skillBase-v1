const mongoose = require('mongoose')

const freelancerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  expertise: {
    type: [String],
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
  },
}, { timestamps: true });

const Freelancer = mongoose.model('Freelancer', freelancerSchema);
module.exports = Freelancer;

