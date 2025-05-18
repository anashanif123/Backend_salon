import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discount: { type: Number, required: true }, // e.g., 20 for 20%
  minBookings: { type: Number, required: true }, // Minimum bookings to qualify
  expiryDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model('Deal', dealSchema);