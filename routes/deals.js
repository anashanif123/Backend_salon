import express from 'express';
import Deal from '../models/Deal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all active deals
router.get('/', async (req, res) => {
  try {
    const currentDate = new Date(); // Use real system time (10:14 AM PKT, May 18, 2025)
    console.log('Current time:', currentDate.toISOString());
    const deals = await Deal.find({ expiryDate: { $gt: currentDate } });
    console.log('Found deals:', deals);
    if (deals.length === 0) {
      console.log('No active deals found');
    }
    res.json(deals);
  } catch (error) {
    console.error('Get deals error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a deal (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { title, description, discount, expiryDate } = req.body;
  if (!title || !description || !discount || !expiryDate) {
    console.log('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Missing required fields: title, description, discount, expiryDate' });
  }

  try {
    const deal = new Deal({ title, description, discount, expiryDate: new Date(expiryDate) });
    await deal.save();
    console.log('Deal created:', deal._id);
    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;