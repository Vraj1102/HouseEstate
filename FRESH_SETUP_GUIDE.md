# HouseEstate MERN Project - Fresh Setup Guide

## After PC Reset - Complete Installation & Running Instructions

### Prerequisites to Install First

1. **Node.js & npm**
   - Download from: https://nodejs.org/
   - Recommended version: Node.js 18.x or 20.x LTS
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation:
     ```bash
     git --version
     ```

3. **MongoDB** (Choose ONE option):
   
   **Option A: MongoDB Atlas (Cloud - Recommended)**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign in to your existing account or create new
   - Get your connection string from your cluster
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/houseestate?retryWrites=true&w=majority`

   **Option B: MongoDB Local Installation**
   - Download from: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Server
   - Default connection: `mongodb://localhost:27017/houseestate`

4. **Code Editor**
   - Visual Studio Code: https://code.visualstudio.com/

---

## Step-by-Step Setup Process

### Step 1: Clone the Repository

```bash
# Open Command Prompt or Terminal
# Navigate to your desired location
cd C:\Users\YourName\Projects

# Clone the repository
git clone https://github.com/Vraj1102/HouseEstate.git

# Navigate into project directory
cd HouseEstate
```

---

### Step 2: Install Backend Dependencies

```bash
# From the root directory (HouseEstate)
npm install
```

**Expected packages to be installed:**
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cookie-parser
- nodemon (dev dependency)

---

### Step 3: Install Frontend Dependencies

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Go back to root
cd ..
```

**Expected packages to be installed:**
- react
- react-dom
- react-router-dom
- redux
- react-redux
- @reduxjs/toolkit
- redux-persist
- firebase
- swiper
- flowbite-react
- react-icons
- vite (dev dependency)
- tailwindcss (dev dependency)

---

### Step 4: Create Environment Variables File

Create a file named `.env` in the **root directory** (not in client folder):

```bash
# Create .env file
# On Windows Command Prompt:
type nul > .env

# Or manually create .env file in root directory
```

**Add the following content to `.env` file:**

```env
# MongoDB Connection String
MONGO=your_mongodb_connection_string_here

# JWT Secret Key (use a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Port (optional, defaults to 3000)
PORT=3000
```

**Example `.env` file:**

```env
# For MongoDB Atlas
MONGO=mongodb+srv://vraj:yourPassword123@cluster0.abc123.mongodb.net/houseestate?retryWrites=true&w=majority

# For Local MongoDB
# MONGO=mongodb://localhost:27017/houseestate

# JWT Secret (generate a random string)
JWT_SECRET=my-super-secret-jwt-key-12345-abcdef

PORT=3000
```

---

### Step 5: Firebase Configuration (For Google OAuth)

If you're using Google Sign-In, you need Firebase credentials:

1. **Get Firebase Config:**
   - Go to: https://console.firebase.google.com/
   - Sign in with your Google account
   - Select your existing "mern-realestate-59d0e" project (or create new)
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Copy the Firebase configuration

2. **Update Firebase Config in Code:**
   - Open: `client/src/firebase.js`
   - Replace with your Firebase credentials:

```javascript
// client/src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
```

---

### Step 6: Verify File Structure

Make sure your project structure looks like this:

```
HouseEstate/
├── api/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── firebase.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .env                    # ← YOU MUST CREATE THIS
├── .gitignore
├── package.json
└── README.md
```

---

### Step 7: Run the Application

#### Option A: Run Both Server and Client Together (Recommended)

```bash
# From root directory
npm run dev:all
```

This will start:
- Backend server on: http://localhost:3000
- Frontend client on: http://localhost:5173

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
# From root directory
npm run dev
```

**Terminal 2 - Frontend:**
```bash
# Navigate to client folder
cd client
npm run dev
```

---

## Access Points

After successful startup:

- **Main Application**: http://localhost:5173
- **API Server**: http://localhost:3000
- **Admin Panel**: http://localhost:5173/admin (after logging in as admin)

---

## Create Admin User (First Time Setup)

If you need to create an admin user:

### Method 1: Using setupAdmin.js Script

If you have a `setupAdmin.js` script in your project:

```bash
node setupAdmin.js
```

### Method 2: Direct Database Update

1. First, create a regular user account through the signup page
2. Connect to MongoDB and update the user's role:

**Using MongoDB Compass:**
- Connect to your database
- Navigate to `houseestate` → `users` collection
- Find your user
- Edit document and change `role: "user"` to `role: "admin"`

**Using MongoDB Shell:**
```javascript
use houseestate
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Troubleshooting Common Issues

### Issue 1: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Check your `MONGO` connection string in `.env`
- Ensure MongoDB service is running (if using local MongoDB)
- Verify network access in MongoDB Atlas (whitelist your IP)
- Check username/password in connection string

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# On Windows, kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Change port in .env
PORT=3001
```

### Issue 3: Module Not Found

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for client folder
cd client
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Firebase Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solution:**
- Update `client/src/firebase.js` with correct credentials
- Enable Google Sign-In in Firebase Console
- Add authorized domains in Firebase Console

### Issue 5: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Check `api/index.js` has proper CORS configuration
- Ensure proxy is set in `client/vite.config.js`:

```javascript
// client/vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
});
```

### Issue 6: Build Errors

**Error:** Various build/compile errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall everything
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm install
cd client && npm install
```

---

## Important Files to Check

### 1. `.env` (Root directory)
```env
MONGO=mongodb+srv://username:password@cluster.mongodb.net/houseestate
JWT_SECRET=your-secret-key
PORT=3000
```

### 2. `package.json` (Root directory)
Check scripts section:
```json
{
  "scripts": {
    "dev": "nodemon api/index.js",
    "start": "node api/index.js",
    "client": "npm run dev --prefix client",
    "dev:all": "concurrently \"npm run dev\" \"npm run client\""
  }
}
```

### 3. `client/vite.config.js`
Check proxy configuration:
```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
});
```

### 4. `.gitignore`
Ensure these are ignored:
```
node_modules/
.env
dist/
client/dist/
.DS_Store
```

---

## Testing the Setup

### 1. Test Backend API

Open browser and go to:
- http://localhost:3000/api/test (if you have a test route)

### 2. Test Frontend

Open browser and go to:
- http://localhost:5173

### 3. Test MongoDB Connection

Check terminal output when starting backend:
- Should see: `MongoDB is connected` or similar message

### 4. Test Features

- ✅ Sign Up new user
- ✅ Sign In with credentials
- ✅ Google Sign-In (if configured)
- ✅ Create a listing
- ✅ View listings
- ✅ Search properties
- ✅ Admin panel access (if admin user)

---

## Production Deployment (Optional)

If you want to deploy to production:

### Build for Production

```bash
# Build client
cd client
npm run build

# This creates client/dist folder with optimized production files
```

### Environment Variables for Production

Update `.env` for production:
```env
MONGO=your_production_mongodb_url
JWT_SECRET=strong-random-production-secret
NODE_ENV=production
PORT=3000
```

---

## Quick Start Commands Summary

```bash
# After fresh PC setup:

# 1. Install Node.js, Git, MongoDB (if local)

# 2. Clone repository
git clone https://github.com/Vraj1102/HouseEstate.git
cd HouseEstate

# 3. Install dependencies
npm install
cd client && npm install && cd ..

# 4. Create .env file with MongoDB and JWT credentials

# 5. Run application
npm run dev:all

# 6. Access application at http://localhost:5173
```

---

## Backup Checklist

Before resetting PC, make sure you have:

- ✅ Backed up `.env` file (contains sensitive data - NOT in GitHub)
- ✅ Saved Firebase credentials
- ✅ Saved MongoDB Atlas credentials
- ✅ Noted any custom configurations
- ✅ Exported MongoDB data (if needed)
- ✅ Pushed all code changes to GitHub

---

## After Setup Checklist

- ✅ Node.js installed and working
- ✅ Git installed and working
- ✅ Project cloned from GitHub
- ✅ All npm packages installed (root and client)
- ✅ .env file created with correct credentials
- ✅ MongoDB connection working
- ✅ Firebase configured (if using Google Auth)
- ✅ Backend server running on port 3000
- ✅ Frontend running on port 5173
- ✅ Can access main application
- ✅ Can create and sign in users
- ✅ Admin user created (if needed)

---

## Support & Resources

- **GitHub Repository:** https://github.com/Vraj1102/HouseEstate.git
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Firebase Console:** https://console.firebase.google.com/
- **Node.js Documentation:** https://nodejs.org/docs/
- **React Documentation:** https://react.dev/
- **Vite Documentation:** https://vitejs.dev/

---

## Contact & Notes

Keep this document handy after PC reset!

**Important:** Never commit your `.env` file or Firebase credentials to GitHub!
