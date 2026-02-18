const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const auth = require('../middleware/auth'); // JWT middleware

// Create Election (Admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  
  try {
    const election = new Election({
      ...req.body,
      createdBy: req.user._id
    });
    await election.save();
    res.status(201).json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Elections
router.get('/', auth, async (req, res) => {
  try {
    const elections = await Election.find().populate('candidates');
    res.json(elections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Election
router.get('/:id', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id).populate('candidates');
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Election (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const election = await Election.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Election (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    res.json({ message: 'Election deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
