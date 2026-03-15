const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  customerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerUsername: {
    type: String,
    required: true,
    trim: true,
  },
  freelancerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancerName: {
    type: String,
    required: true,
    trim: true,
  },
  freelancerEmail: {
    type: String,
    required: true,
    trim: true,
  },
  freelancerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  serviceType: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
