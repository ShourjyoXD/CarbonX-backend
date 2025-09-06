const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true 
  },
  email: {
    type: String,
    unique: true,
    sparse: true
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
  nfts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT' 
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);