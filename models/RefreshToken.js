const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: {
    type: String,
    required: true,
    ref: 'User'
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);