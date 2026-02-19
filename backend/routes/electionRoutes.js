const express = require('express');
const Election = require('../models/Election');
const authMiddleware = require('../middleware/authMiddleware');
const Vote = require('../models/Vote');


const router = express.Router();

/** GET ALL ELECTIONS */
router.get('/', async (_req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    return res.status(200).json(elections);
  } catch (error) {
    console.error('GET ELECTIONS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/** GET SINGLE ELECTION */
router.get('/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: 'Election not found' });
    return res.status(200).json(election);
  } catch (error) {
    console.error('GET ELECTION ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/** CREATE ELECTION (protected for now) */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, candidates } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const safeCandidates = Array.isArray(candidates)
      ? candidates.filter(c => c && c.name).map(c => ({ name: String(c.name).trim() }))
      : [];

    const election = await Election.create({
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      status: status || 'upcoming',
      candidates: safeCandidates
    });

    return res.status(201).json(election);
  } catch (error) {
    console.error('CREATE ELECTION ERROR:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
});
/** VOTE (protected) */
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({ message: 'candidateId is required' });
    }

  const election = await Election.findById(req.params.id);
if (!election) return res.status(404).json({ message: 'Election not found' });


// ✅ status control
if (election.status !== 'active') {
  return res.status(403).json({
    message: `Voting is not allowed. Election is currently ${election.status}.`
  });
}


    // Make sure candidate exists inside election
    const candidate = election.candidates.id(candidateId);
    if (!candidate) {
      return res.status(400).json({ message: 'Candidate not found in this election' });
    }

    const Vote = require('../models/Vote');

    // Create vote record (will fail if user already voted due to unique index)
    await Vote.create({
      voter: req.user.id,
      election: election._id,
      candidateId
    });

    // Increment candidate votes
    candidate.votes += 1;
    await election.save();

    return res.status(200).json({ message: 'Vote submitted successfully' });

  } catch (error) {
    console.error('VOTE ERROR:', error);

    // Duplicate vote prevention
    if (error.code === 11000) {
      return res.status(409).json({ message: 'You have already voted in this election' });
    }

    return res.status(500).json({ message: error.message || 'Server error' });
  }
});
/** UPDATE ELECTION STATUS (Admin only for now) */
router.patch('/:id/status', authMiddleware, async (req, res) => {
  
  try {
    // ✅ Admin-only
if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
  return res.status(403).json({ message: 'Access denied. Admins only.' });
}

    const { status } = req.body;

    if (!['upcoming', 'active', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    election.status = status;
    await election.save();

    return res.status(200).json(election);
  } catch (error) {
    console.error('UPDATE STATUS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
/** HAS CURRENT USER VOTED IN THIS ELECTION? (privacy-safe) */
router.get('/:id/my-vote', authMiddleware, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      election: req.params.id,
      voter: req.user.id
    }).select('createdAt'); // do NOT return candidateId

    return res.status(200).json({
      hasVoted: !!vote,
      votedAt: vote ? vote.createdAt : null
    });
  } catch (error) {
    console.error('MY VOTE STATUS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
/** LIST VOTERS WHO VOTED (Admin only) */
router.get('/:id/voters', authMiddleware, async (req, res) => {
  try {
    // Admin-only
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const votes = await Vote.find({ election: req.params.id })
      .populate('voter', 'fullName email role')
      .sort({ createdAt: -1 });

    const voters = votes.map(v => ({
      voterId: v.voter?._id,
      fullName: v.voter?.fullName,
      email: v.voter?.email,
      role: v.voter?.role,
      votedAt: v.createdAt
    }));

    return res.status(200).json({
      totalVotes: voters.length,
      voters
    });
  } catch (error) {
    console.error('VOTER LIST ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
