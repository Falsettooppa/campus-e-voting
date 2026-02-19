const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0 }
  },
  { _id: true }
);

const electionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'active', 'closed'], default: 'upcoming' },
    candidates: { type: [candidateSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Election', electionSchema);
