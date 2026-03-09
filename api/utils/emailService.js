import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not configured');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email, otp, type) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    throw new Error('Email service not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
  }
  
  const subject = type === 'password_reset' ? 'Password Reset OTP' : 'Account Deletion OTP';
  const message = type === 'password_reset' 
    ? `Your OTP for password reset is: ${otp}. This OTP will expire in 10 minutes.`
    : `Your OTP for account deletion is: ${otp}. This OTP will expire in 10 minutes.`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">${subject}</h2>
        <p>Hello,</p>
        <p>${message}</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1e40af; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">HouseEstate - Real Estate Platform</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
