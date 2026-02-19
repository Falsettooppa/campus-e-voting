const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    election: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Election',
      required: true
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

// Prevent double voting per election
voteSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
