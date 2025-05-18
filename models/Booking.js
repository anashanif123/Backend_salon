import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  sessionId: { type: String },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);