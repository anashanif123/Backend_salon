// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookings.js';
import serviceRoutes from './routes/services.js';
import dealRoutes from './routes/deals.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://salon-frontend-ebon.vercel.app',
  'https://salon-frontend-pbeoy010p-anas-projects-dfbef841.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Validate environment variables
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'STRIPE_SECRET_KEY', 'ADMIN_EMAIL'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/deals', dealRoutes); 

app.get('/', (req, res) => {
  res.send(`<h2>Server is running! 🚀</h2>
    <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
    <p>Port: ${PORT}</p>
    <p>Deployed at: ${new Date().toLocaleString()}</p>`);
});

// Global error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// MongoDB connection and server start (modern async/await)
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

startServer();