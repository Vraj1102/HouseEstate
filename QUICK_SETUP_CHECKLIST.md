# Quick Setup Checklist - Post PC Reset

## ⚡ Fast Track Setup (30 Minutes)

### STEP 1: Install Software (15 min)
```
□ Install Node.js from https://nodejs.org/ (Choose LTS version)
□ Install Git from https://git-scm.com/
□ Install VS Code from https://code.visualstudio.com/
□ (Optional) Install MongoDB Compass for database management
```

### STEP 2: Clone & Install (5 min)
```bash
# Open Command Prompt
cd C:\Users\Vraj\Downloads\MCA\Sem-4
git clone https://github.com/Vraj1102/HouseEstate.git
cd HouseEstate
npm install
cd client
npm install
cd ..
```

### STEP 3: Environment Setup (5 min)
```
□ Create .env file in root directory
□ Add MongoDB connection string
□ Add JWT secret key
```

**Your .env file should contain:**
```env
MONGO=mongodb+srv://vraj:YOUR_PASSWORD@cluster.mongodb.net/houseestate
JWT_SECRET=your-random-secret-key-here
PORT=3000
```

### STEP 4: Firebase Configuration (3 min)
```
□ Go to https://console.firebase.google.com/
□ Select "mern-realestate-59d0e" project
□ Copy Firebase config
□ Update client/src/firebase.js with your credentials
```

### STEP 5: Run Application (2 min)
```bash
npm run dev:all
```

**Check:**
```
□ Backend running on http://localhost:3000
□ Frontend running on http://localhost:5173
□ Can access homepage
□ Can sign up/sign in
```

---

## 🚨 Critical Files to Have Ready

### Before PC Reset - Save These:

1. **MongoDB Connection String**
   - From MongoDB Atlas dashboard
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/houseestate`

2. **JWT Secret Key**
   - Random string from your current .env file

3. **Firebase Credentials**
   - From Firebase Console → Project Settings
   - apiKey, authDomain, projectId, etc.

4. **Admin User Credentials**
   - Email and password of your admin account

---

## 📋 Commands Reference

### Initial Setup
```bash
# Clone repository
git clone https://github.com/Vraj1102/HouseEstate.git
cd HouseEstate

# Install all dependencies
npm install
cd client && npm install && cd ..

# Run application
npm run dev:all
```

### If Something Goes Wrong
```bash
# Reinstall everything
rm -rf node_modules client/node_modules package-lock.json client/package-lock.json
npm install
cd client && npm install && cd ..

# Clear npm cache
npm cache clean --force

# Check Node/npm versions
node --version
npm --version
```

---

## ✅ Success Indicators

You'll know setup is successful when:
- ✅ Terminal shows "MongoDB is connected"
- ✅ Terminal shows "Server is running on port 3000"
- ✅ Browser shows homepage at localhost:5173
- ✅ No error messages in terminal or browser console
- ✅ Can navigate between pages
- ✅ Can sign up new user

---

## 🔧 Common Quick Fixes

### "Cannot find module"
```bash
npm install
cd client && npm install
```

### "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### "MongoDB connection error"
- Check MONGO string in .env
- Verify password has no special characters that need encoding
- Check internet connection

### "Firebase error"
- Update client/src/firebase.js with correct config
- Enable Google Sign-In in Firebase Console

---

## 📝 .env Template

Copy this and fill in your values:

```env
# MongoDB Atlas Connection
MONGO=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/houseestate?retryWrites=true&w=majority

# JWT Secret (use any random string)
JWT_SECRET=my-super-secret-jwt-key-12345

# Server Port (default 3000)
PORT=3000
```

---

## 🎯 Project Structure Check

Your folder should look like:
```
HouseEstate/
├── api/                    ← Backend
├── client/                 ← Frontend
├── .env                    ← CREATE THIS!
├── package.json           
└── README.md
```

---

## 💾 What to Save Before Reset

**CRITICAL - Save these somewhere safe:**

1. `.env` file contents (MongoDB URL, JWT Secret)
2. Firebase configuration from `client/src/firebase.js`
3. Admin user email/password
4. Any custom configuration changes you made

**Already on GitHub (no need to save):**
- All source code
- Package.json files
- Project structure

---

## 🚀 One-Line Commands

After installing Node.js and Git:

```bash
# Complete setup in one go
git clone https://github.com/Vraj1102/HouseEstate.git && cd HouseEstate && npm install && cd client && npm install && cd .. && echo "Now create .env file with MongoDB and JWT credentials, then run: npm run dev:all"
```

---

## 📞 Quick Help

**Can't connect to MongoDB?**
→ Check .env file has correct MONGO connection string

**Can't start server?**
→ Make sure .env file exists in root directory (not in client folder)

**Firebase not working?**
→ Update client/src/firebase.js with your project credentials

**Port 3000 busy?**
→ Either kill the process or change PORT in .env to 3001

---

## ⏱️ Time Estimates

- Installing Node.js, Git: 10-15 minutes
- Cloning repository: 2-3 minutes
- Installing npm packages: 5-10 minutes
- Creating .env file: 2-3 minutes
- First run: 1-2 minutes

**Total: ~25-35 minutes for complete setup**

---

## 🎉 Done!

Once you see:
- `Server is running on port 3000`
- `MongoDB is connected`
- Vite dev server at `localhost:5173`

**You're ready to use the application!**

Visit: http://localhost:5173

---

## Emergency Contact Info

If stuck, check:
1. FRESH_SETUP_GUIDE.md (detailed guide)
2. README.md (project overview)
3. GitHub Issues: https://github.com/Vraj1102/HouseEstate/issues

Keep this checklist handy! 📌
