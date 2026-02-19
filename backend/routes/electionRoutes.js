const express = require('express');
const Election = require('../models/Election');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/*
========================================
CREATE ELECTION (Admin Only)
========================================
*/
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, candidates, startDate, endDate } = req.body;

    if (!title || !candidates || candidates.length === 0) {
      return res.status(400).json({
        message: 'Title and at least one candidate are required.'
      });
    }

    const election = await Election.create({
      title,
      description,
      candidates,
      startDate,
      endDate,
      createdBy: req.user.id
    });

    return res.status(201).json(election);

  } catch (error) {
    console.error('CREATE ELECTION ERROR:', error);

    return res.status(500).json({
      message: error.message || 'Server error while creating election.'
    });
  }
});


/*
========================================
GET ALL ELECTIONS
========================================
*/
router.get('/', async (_req, res) => {
  try {
    const elections = await Election.find();

    return res.status(200).json(elections);

  } catch (error) {
    console.error('GET ELECTIONS ERROR:', error);

    return res.status(500).json({
      message: error.message || 'Server error.'
    });
  }
});

module.exports = router;
