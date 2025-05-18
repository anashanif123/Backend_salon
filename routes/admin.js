import express from 'express';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all bookings (admin only)
router.get('/bookings', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const bookings = await Booking.find().populate('user service');
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
