import express from 'express';
import Service from '../models/Service.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a service (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { name, description, price, duration } = req.body;
  if (!name || !description || !price || !duration) {
    console.log('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Missing required fields: name, description, price, duration' });
  }

  try {
    const service = new Service({ name, description, price, duration });
    await service.save();
    console.log('Service created:', service._id);
    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a service (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { name, description, price, duration } = req.body;
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration },
      { new: true }
    );
    if (!service) {
      console.log('Service not found:', req.params.id);
      return res.status(404).json({ message: 'Service not found' });
    }
    console.log('Service updated:', service._id);
    res.json(service);
  } catch (error) {
    console.error('Update service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a service (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    console.log('Access denied: Not an admin', req.user);
    return res.status(403).json({ message: 'Admin access required' });
  }

  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      console.log('Service not found:', req.params.id);
      return res.status(404).json({ message: 'Service not found' });
    }
    console.log('Service deleted:', req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('Delete service error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
