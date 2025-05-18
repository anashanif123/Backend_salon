import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Stripe from 'stripe';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', auth, async (req, res) => {
  console.log('Booking request:', req.body, 'User:', req.user);
  const { serviceId, date, time, paymentMethod } = req.body;

  // Input validation
  if (!serviceId || !date || !time || !paymentMethod) {
    console.log('Validation error: Missing required fields');
    return res.status(400).json({ message: 'Missing required fields: serviceId, date, time, paymentMethod' });
  }
  if (!['cash', 'card'].includes(paymentMethod)) {
    console.log('Validation error: Invalid payment method:', paymentMethod);
    return res.status(400).json({ message: 'Invalid payment method. Must be "cash" or "card"' });
  }
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    console.log('Validation error: Invalid date format:', date);
    return res.status(400).json({ message: 'Invalid date format' });
  }
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    console.log('Validation error: Invalid time format:', time);
    return res.status(400).json({ message: 'Invalid time format. Use HH:MM' });
  }

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      console.log('Service not found:', serviceId);
      return res.status(404).json({ message: `Service not found for ID: ${serviceId}` });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    let session;
    if (paymentMethod === 'card') {
      try {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: { name: service.name },
              unit_amount: service.price * 100,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: 'https://salon-frontend-ebon.vercel.app/booking/success',
          cancel_url: 'https://salon-frontend-ebon.vercel.app/booking/cancel',
        });
        console.log('Stripe session created:', session.id);
      } catch (stripeError) {
        console.error('Stripe error:', stripeError.message);
        return res.status(500).json({ message: 'Failed to create Stripe payment session' });
      }
    }

    const booking = new Booking({
      user: req.user.id,
      service: serviceId,
      date: parsedDate,
      time,
      amount: service.price,
      paymentMethod,
      paymentStatus: paymentMethod === 'card' ? 'pending' : 'completed',
      sessionId: session ? session.id : null,
    });

    await booking.save();
    console.log('Booking saved:', booking._id);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Booking Confirmation - Diamond Salon',
        text: `Dear ${user.name},\n\nYour booking for ${service.name} on ${date} at ${time} has been confirmed.\n\nThank you for choosing Diamond Salon!`,
      });
      console.log('Confirmation email sent to:', user.email);
    } catch (emailError) {
      console.error('Email error:', emailError.message);
    }

    res.status(201).json({ sessionId: session ? session.id : null, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Booking error:', error.message, error.stack);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
});

export default router;
