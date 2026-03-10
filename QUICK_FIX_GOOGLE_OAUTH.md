# Quick Fix for Google OAuth

## Step 1: Get Your Firebase API Key

1. Go to: https://console.firebase.google.com/
2. Select project: **mern-realestate-59d0e**
3. Click ⚙️ (Settings) → **Project settings**
4. Scroll to "Your apps" section
5. Find "Web API Key" - Copy it

## Step 2: Add API Key to .env

Open `client/.env` and ensure this line exists:
```
VITE_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

Replace `YOUR_ACTUAL_API_KEY_HERE` with the key you copied.

## Step 3: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication**
2. Click **Sign-in method** tab
3. Find **Google** in the list
4. Click on it and toggle **Enable**
5. Add a support email
6. Click **Save**

## Step 4: Restart Your Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev:all
```

## Step 5: Test

1. Go to: http://localhost:5173/signin
2. Click "Continue with Google"
3. Select your Google account
4. Should work now!

## About Auto Sign-In:

The "auto sign-in" you're seeing is **normal behavior**:
- Your session is saved in browser
- Keeps you logged in (like Gmail, Facebook, etc.)
- To sign out: Click profile → Sign Out

This is NOT a bug - it's a feature for better user experience!

## Still Not Working?

Check browser console (F12) for error messages and refer to GOOGLE_OAUTH_TROUBLESHOOTING.md