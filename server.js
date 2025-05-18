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

app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend domain once deployed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Validate environment variables
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS', 'STRIPE_SECRET_KEY', 'ADMIN_EMAIL'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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