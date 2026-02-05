import nodemailer from 'nodemailer';

// Configure the sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // e.g. 'recoge.clothing@gmail.com'
    pass: process.env.EMAIL_PASS  // Your 16-character Gmail App Password
  }
});

export const sendThankYouEmail = async (toEmail, customerName) => {
  const mailOptions = {
    from: '"Recoge Clothing" <recoge.clothing@gmail.com>',
    to: toEmail,
    subject: 'We hope you love your new fit! 🖤',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0F2854;">Hi ${customerName},</h1>
        <p>Your order was delivered yesterday. We just wanted to reach out and say <strong>Thank You</strong> for choosing Recoge.</p>
        <p>We hope the quality meets your expectations. If you love your new look, please tag us on Instagram <strong>@recoge_clothing</strong>!</p>
        <br/>
        <p>Warm regards,</p>
        <p><strong>The Recoge Team</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed for ${toEmail}:`, error);
    return false;
  }
};