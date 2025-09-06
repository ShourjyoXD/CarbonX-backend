const mongoose = require('mongoose');

const proofSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Challenge', 
  },
  fileUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'validated', 'rejected'],
    default: 'pending',
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Proof', proofSchema);