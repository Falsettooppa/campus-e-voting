const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Admin guard
 */
const requireAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Admin access only.' });
  }
  next();
};

/**
 * Superadmin guard
 */
const requireSuperAdmin = (req, res, next) => {
  const role = req.user?.role;
  if (role !== 'superadmin') {
    return res.status(403).json({ message: 'Superadmin access only.' });
  }
  next();
};

/**
 * GET /api/users
 * List users (admin only)
 * Query: ?q=search
 */
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    const filter = q
      ? {
          $or: [
            { fullName: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(filter)
      .select('_id fullName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(500);

    return res.status(200).json(users);
  } catch (error) {
    console.error('LIST USERS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PATCH /api/users/:id/role
 * Update user role (admin or superadmin)
 * Rules:
 * - admin can set voter/admin only
 * - superadmin can set voter/admin/superadmin
 */
router.patch('/:id/role', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['voter', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const requesterRole = req.user?.role;

    // admin cannot assign superadmin
    if (requesterRole === 'admin' && role === 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can assign superadmin role.' });
    }

    // optional safety: superadmin-only demotion of superadmins
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (targetUser.role === 'superadmin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can modify a superadmin.' });
    }

    targetUser.role = role;
    await targetUser.save();

    return res.status(200).json({
      message: 'Role updated successfully.',
      user: {
        id: targetUser._id,
        fullName: targetUser.fullName,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (error) {
    console.error('UPDATE ROLE ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;