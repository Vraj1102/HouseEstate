# OTP System - Complete Guide

## How It Works Now

The OTP system has been updated to work in **Development Mode** without requiring email configuration.

### Development Mode (Current Setup)

When `NODE_ENV=development` in your `.env` file:

1. **Forgot Password**:
   - User enters email
   - OTP is generated and saved in database
   - **OTP is displayed on screen** (no email needed)
   - User copies OTP and enters it
   - Password is reset

2. **Account Deletion**:
   - User clicks "Delete Account"
   - OTP is generated and saved in database
   - **OTP is displayed in modal** (no email needed)
   - User enters OTP to confirm deletion

### Production Mode (With Email)

When `NODE_ENV=production` and email is configured:

1. OTP is sent via email
2. OTP is NOT displayed on screen
3. User must check their email for OTP

## Current Configuration

Your `.env` file now has:
```
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Features

✅ **Secure OTP Generation**: 6-digit random OTP
✅ **Auto Expiration**: OTPs expire after 10 minutes
✅ **Database Storage**: OTPs stored in MongoDB with TTL
✅ **Development Mode**: OTP displayed on screen (no email needed)
✅ **Production Ready**: Email integration available when configured

## Testing the System

### Test Forgot Password:
1. Go to `/forgot-password`
2. Enter any registered email
3. Click "Send OTP"
4. **OTP will appear in yellow box on screen**
5. Copy and paste OTP
6. Enter new password
7. Done!

### Test Account Deletion:
1. Go to Profile page
2. Click "Delete Account"
3. Click "Send OTP"
4. **OTP will appear in yellow box in modal**
5. Enter OTP
6. Account deleted!

## Setting Up Email (Optional)

If you want to send real emails in production:

### 1. Gmail Setup:
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```
   EMAIL_USER=your_real_email@gmail.com
   EMAIL_PASS=your_16_char_app_password
   NODE_ENV=production
   ```

### 2. Other Email Services:

**Outlook/Hotmail:**
```javascript
// In api/utils/emailService.js
service: 'outlook'
```

**Yahoo:**
```javascript
service: 'yahoo'
```

**Custom SMTP:**
```javascript
host: 'smtp.yourdomain.com',
port: 587,
secure: false,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
}
```

## Security Features

1. **OTP Expiration**: 10 minutes (MongoDB TTL index)
2. **One-Time Use**: OTP deleted after successful verification
3. **Email Validation**: User must exist in database
4. **Secure Storage**: OTPs hashed in database
5. **Rate Limiting**: Can be added to prevent spam

## Troubleshooting

### "Invalid or expired OTP"
- OTP expired (10 minutes passed)
- Wrong OTP entered
- OTP already used

### Email not working
- Check EMAIL_USER and EMAIL_PASS in .env
- Verify Gmail App Password is correct
- Check spam folder
- **Solution**: Use development mode (OTP on screen)

### OTP not displayed
- Make sure `NODE_ENV=development` in .env
- Restart server after changing .env
- Check browser console for errors

## Why This Approach?

1. **No Email Dependency**: Works immediately without email setup
2. **Easy Testing**: See OTP on screen during development
3. **Production Ready**: Switch to email by changing NODE_ENV
4. **Secure**: OTPs still stored in database with expiration
5. **User Friendly**: Clear visual feedback

## Files Modified

- `api/controllers/authController.js` - Password reset OTP
- `api/controllers/userController.js` - Account deletion OTP
- `client/src/pages/ForgotPassword.jsx` - Display OTP in dev mode
- `client/src/pages/Profile.jsx` - Display OTP in delete modal
- `.env` - Added NODE_ENV=development

## Next Steps

1. **Current**: Use development mode (OTP on screen)
2. **Later**: Configure email for production
3. **Deploy**: Change NODE_ENV to production

The system works perfectly now without any email configuration!
