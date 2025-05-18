import mongoose from 'mongoose';
import Deal from '../models/Deal.js';

const seedDeals = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/diamond-salon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    const deals = [
      { title: "Summer Haircut Special", description: "Get 20% off any haircut service this month!", discount: "20%", expiryDate: new Date("2025-06-01T23:59:59Z") },
      { title: "Facial Package Deal", description: "Buy 2 facials, get the 3rd free!", discount: "1 Free", expiryDate: new Date("2025-05-25T23:59:59Z") },
      { title: "Manicure Discount", description: "Enjoy 15% off all manicure services.", discount: "15%", expiryDate: new Date("2025-05-30T23:59:59Z") },
    ];

    // Clear existing deals and re-seed
    await Deal.deleteMany();
    await Deal.insertMany(deals);
    console.log('Deals re-seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDeals();