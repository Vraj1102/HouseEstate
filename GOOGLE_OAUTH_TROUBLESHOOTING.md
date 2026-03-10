# Google OAuth Troubleshooting Guide

## Issue 1: "Could not sign in with Google" Error

### Solution Steps:

1. **Check Firebase API Key:**
   - Open `client/.env` file
   - Ensure `VITE_FIREBASE_API_KEY` is set correctly
   - Get your API key from Firebase Console: https://console.firebase.google.com/

2. **Enable Google Sign-In in Firebase:**
   - Go to Firebase Console
   - Select your project: `mern-realestate-59d0e`
   - Navigate to **Authentication** → **Sign-in method**
   - Enable **Google** provider
   - Add authorized domains (localhost, your domain)

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Console tab for detailed error messages
   - Look for Firebase or network errors

4. **Restart Development Server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Restart
   npm run dev:all
   ```

## Issue 2: Auto Sign-In on Page Load

This is **EXPECTED BEHAVIOR** - not a bug!

### Why This Happens:
- Redux Persist stores user session in localStorage
- Keeps users logged in across page refreshes
- Standard practice for better UX

### To Sign Out:
1. Click on your profile picture in header
2. Go to Profile page
3. Click "Sign Out" button

### To Clear Session (for testing):
```javascript
// Open browser console and run:
localStorage.clear();
// Then refresh page
```

## Firebase Configuration Checklist:

✅ **Firebase Project Setup:**
1. Go to https://console.firebase.google.com/
2. Select project: `mern-realestate-59d0e`
3. Go to **Project Settings** → **General**
4. Copy **Web API Key**
5. Add to `client/.env`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   ```

✅ **Enable Google Authentication:**
1. Go to **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable**
4. Add support email
5. Save

✅ **Add Authorized Domains:**
1. In **Authentication** → **Settings** → **Authorized domains**
2. Ensure these are added:
   - `localhost`
   - Your production domain (if any)

## Common Errors and Solutions:

### Error: "Firebase: Error (auth/popup-closed-by-user)"
**Solution:** User closed the popup. Try again.

### Error: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** Add your domain to Firebase authorized domains.

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution:** Check your API key in `.env` file.

### Error: Network request failed
**Solution:** Check if backend server is running on port 3000.

## Testing Google OAuth:

1. **Clear browser data** (for fresh test)
2. **Go to sign-in page**: http://localhost:5173/signin
3. **Click "Continue with Google"**
4. **Select Google account**
5. **Check console** for any errors
6. **Should redirect** to home page or admin panel

## Debug Mode:

The OAuth component now includes console logs:
- Check browser console for:
  - "Google sign in result"
  - "Backend response"
  - Any error messages

## Need Help?

If still not working:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify Firebase configuration
4. Ensure all environment variables are set
5. Restart both frontend and backend servers