# Quick Email Setup Guide

## Error: "Missing credentials for PLAIN"

This error occurs when EMAIL_USER and EMAIL_PASS are not configured in your .env file.

## Setup Steps:

### 1. Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled
4. After enabling 2FA, go back to Security
5. Click on "App passwords" (you'll see this only after 2FA is enabled)
6. Select "Mail" and "Other (Custom name)"
7. Name it "HouseEstate"
8. Click "Generate"
9. Copy the 16-character password (no spaces)

### 2. Update .env File

Open your `.env` file in the root directory and update:

```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
```

Example:
```env
EMAIL_USER=johndoe@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 3. Restart Server

```bash
npm run dev
```

## Testing

1. Go to Forgot Password page
2. Enter your email
3. Click "Send OTP"
4. Check your email inbox (and spam folder)
5. You should receive a 6-digit OTP

## Troubleshooting

- **Still getting error**: Make sure you copied the app password correctly (remove any spaces)
- **Email not received**: Check spam folder
- **Wrong credentials**: Regenerate app password and update .env
- **2FA not enabled**: You must enable 2-Step Verification first

## Alternative: Use Different Email Service

If you don't want to use Gmail, update `api/utils/emailService.js`:

For Outlook:
```javascript
service: 'outlook'
```

For Yahoo:
```javascript
service: 'yahoo'
```

For custom SMTP:
```javascript
host: 'smtp.yourdomain.com',
port: 587,
secure: false,
```
