import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (to, booking) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Diamond Salon Booking Confirmation',
    html: `
      <h2>Booking Confirmed</h2>
      <p>Dear ${booking.user.name},</p>
      <p>Your booking for <strong>${booking.service.name}</strong> on <strong>${booking.date.toDateString()}</strong> at <strong>${booking.time}</strong> has been confirmed.</p>
      <p>Amount: $${booking.amount}</p>
      <p>Payment Method: ${booking.paymentMethod}</p>
      <p>Thank you for choosing Diamond Salon!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminNotification = async (booking) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Booking at Diamond Salon',
    html: `
      <h2>New Booking</h2>
      <p>User: ${booking.user.name}</p>
      <p>Service: ${booking.service.name}</p>
      <p>Date: ${booking.date.toDateString()}</p>
      <p>Time: ${booking.time}</p>
      <p>Amount: $${booking.amount}</p>
      <p>Payment Method: ${booking.paymentMethod}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
