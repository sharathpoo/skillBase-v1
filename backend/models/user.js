const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'freelancer'],
    default: 'user',
    required: true,
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
