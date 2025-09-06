const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastChallengeDate: {
    type: Date,
    default: null,
  },
  badges: [{
    type: String,
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);