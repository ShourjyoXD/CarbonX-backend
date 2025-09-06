const mongoose = require('mongoose');

const challengeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rewardXP: {
    type: Number,
    required: true,
    default: 0,
  },
  rewardTokens: {
    type: Number,
    required: true,
    default: 0,
  },
  badgeId: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  proofType: {
    type: String,
    enum: ['photo', 'qr'],
    default: 'photo',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Challenge', challengeSchema);