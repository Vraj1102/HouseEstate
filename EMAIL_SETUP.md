# Email Configuration Setup

## Gmail Setup for OTP Email Service

To enable OTP email functionality for password reset and account deletion, you need to configure Gmail with an App Password.

### Steps:

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "HouseEstate App"
   - Copy the 16-character password

3. **Update .env file**
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

4. **Restart the server**
   ```bash
   npm run dev
   ```

## Features Using Email:

1. **Password Reset**: Users receive a 6-digit OTP to reset their password
2. **Account Deletion**: Users receive a 6-digit OTP to confirm account deletion

## OTP Expiration:
- OTPs expire after 10 minutes for security

## Testing:
- Use a real email address to test the OTP functionality
- Check spam folder if email doesn't arrive in inbox
