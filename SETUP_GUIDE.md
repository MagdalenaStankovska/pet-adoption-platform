# 🚀 Setup & Getting Started Guide

Welcome to **PawfectMatch** - the professional pet adoption platform! This guide will walk you through everything you need to get up and running.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Seeding Database](#seeding-database)
6. [Running the Project](#running-the-project)
7. [Verifying Everything Works](#verifying-everything-works)

---

## ✅ System Requirements

Before you start, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)
- **MongoDB Atlas Account** (free) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Text Editor** (VS Code recommended)
- **Web Browser** (Chrome, Firefox, Safari, Edge)

**Check your versions:**
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
```

---

## 🗄️ MongoDB Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"**
3. Sign up with email and create a password
4. Accept the terms and create your account
5. Check your email for confirmation link and verify

### Step 2: Create a Free MongoDB Cluster

1. After logging in, click **"Create"** to build a new project or use the default one
2. Click **"Build a Database"**
3. Choose **"Free Tier"** option (M0 Cluster)
4. Select your preferred cloud provider (AWS, Google Cloud, or Azure - doesn't matter for free tier)
5. Select a region closest to you
6. Click **"Create Cluster"** and wait 2-3 minutes for it to deploy

### Step 3: Create Database User

1. In the left menu, go to **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username: `admin`
5. Enter password: Create a strong password (remember it!)
6. Click **"Add User"**

**Save your credentials:**
```
Username: admin
Password: MySecurePassword123
```

### Step 4: Get Connection String

1. Go to **"Clusters"** in the left menu
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string that looks like:
```
mongodb+srv://admin:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

5. Replace `<password>` with your password
6. Replace `?` with `/pet-adoption?` (to specify database name)

**Final connection string should be:**
```
mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/pet-adoption?retryWrites=true&w=majority
```

### Step 5: Whitelist IP Address

1. Go to **"Network Access"** in the left menu
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (for development)
   - Or enter your IP address for production
4. Click **"Confirm"**

---

## 🖥️ Backend Setup

### Step 1: Navigate to Server Directory

Open your terminal/command prompt:

```bash
cd pet-adoption-platform
cd server
```

### Step 2: Create .env File

Create a new file called `.env` in the `server` directory:

**Contents of `server/.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://admin:MySecurePassword123@cluster0.abc123.mongodb.net/pet-adoption?retryWrites=true&w=majority
```

Replace the `MONGO_URI` with your actual connection string from MongoDB Atlas.

### Step 3: Install Dependencies

```bash
npm install
```

This installs all required packages:  
- express (web framework)
- mongoose (database connector)
- cors (secure cross-origin requests)
- dotenv (environment variables)
- nodemon (auto-reload during development)

Wait for installation to complete (about 1-2 minutes).

### Step 4: Verify Backend Installation

```bash
npm list
```

You should see `mongoose` and `express` in the list with version numbers.

---

## 💻 Frontend Setup

### Step 1: Navigate to Client Directory

Open a **new terminal/command prompt**:

```bash
cd pet-adoption-platform
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- react (UI library)
- react-router-dom (navigation)
- react-scripts (build tools)

Wait for installation (about 2-3 minutes).

### Step 3: Verify Frontend Installation

```bash
npm list react
```

Should show React with version 18+.

---

## 🌱 Seeding Database

### Option 1: Run Setup Script (Recommended for Windows)

**On Windows**, run this in the project root directory:

```bash
setup.bat
```

**On Mac/Linux**, run:
```bash
bash setup.sh
```

This script will:
- Check if `.env` file exists
- Install dependencies if needed
- Seed database with professional pet data
- Show you demo credentials

### Option 2: Manual Seeding

If the script doesn't work, seed manually:

```bash
cd server
node -e "require('dotenv').config(); require('./utils/seedDatabase')().catch(console.error);"
```

### What Gets Seeded?

✅ **10 Professional Pets**
- High-quality images from Unsplash
- Realistic breed information
- Detailed descriptions matching each pet's characteristics
- Health status and adoption status

✅ **3 Demo User Accounts**
- Regular User: `john@example.com` / `password123`
- Regular User: `sarah@example.com` / `password123`
- Admin User: `admin@example.com` / `admin123`

✅ **Sample Data**
- Adoption requests
- Favorite relationships
- Shelter information

---

## 🎯 Running the Project

### Step 1: Start Backend Server

Open a terminal:

```bash
cd pet-adoption-platform/server
npm start
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

**Keep this terminal open!**

### Step 2: Start Frontend Application

Open a **new terminal**:

```bash
cd pet-adoption-platform/client
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

If it doesn't open, manually navigate to `http://localhost:3000`

---

## ✨ Verifying Everything Works

### 1. Check Backend is Running

Open `http://localhost:5000/api/pets` in your browser.

You should see JSON data with pet information:
```json
[
  {
    "id": 1,
    "name": "Max",
    "age": 3,
    "breed": "Golden Retriever",
    ...
  }
]
```

### 2. Check Frontend Loads

Visit `http://localhost:3000` in browser.

You should see:
- ✅ Cute paw print decorations
- ✅ "PawfectMatch" header
- ✅ Welcome message
- ✅ "View Pets" and "Get Started" buttons
- ✅ Professional styling with gradients

### 3. Test Pet Browsing

1. Click "View Pets" button
2. You should see a grid of 10 pet cards
3. Each card shows:
   - Pet image
   - Pet name
   - Age, gender
   - Brief description
   - Health status
   - "Adopt" and "Save" buttons

### 4. Test User Registration

1. Click "Get Started" button
2. Fill in the registration form:
   - Full Name
   - Email (must be unique)
   - Password
   - Phone (optional)
3. Click "Register"
4. You should see a success message
5. Can now log in with your email and password

### 5. Test Adoption Request

1. Log in with demo credentials: `john@example.com` / `password123`
2. Go to "Pets" page
3. Click on any pet card
4. Click "🏠 Start Adoption" button
5. Should see "Adoption request submitted! 🎉"
6. Go to "Profile" to see your adoption requests

### 6. Admin Dashboard (Optional)

1. Log in as admin: `admin@example.com` / `admin123`
2. You'll see additional menu items:
   - "➕ Add Pet"
   - "📊 Dashboard"
3. Click "Dashboard" to see all adoption requests
4. Click "Add Pet" to add new pets to the system

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Error: MONGO_URI environment variable not set`

**Solution:**
```bash
# Check if .env file exists
ls server/.env  # Mac/Linux
dir server\.env  # Windows

# Verify MONGO_URI is set
cat server/.env  # Mac/Linux
type server\.env  # Windows
```

---

### Can't Connect to MongoDB

**Error:** `MongooseServerSelectionError`

**Solutions:**
1. Verify connection string is correct in `.env`
2. Check MongoDB Atlas cluster is running (go to Atlas and verify)
3. Whitelist your IP in MongoDB Atlas:
   - Go to "Network Access"
   - Add your IP address
4. Check password doesn't have special characters that need escaping

---

### Frontend Can't Connect to Backend

**Error:** Network errors in browser console

**Solutions:**
1. Make sure backend is running (`npm start` in server directory)
2. Check backend is on port 5000
3. If running remotely, update API URL in frontend code:
   - Change `localhost:5000` to your server IP

---

### "Port 5000 already in use"

**Solution:**
```bash
# Linux/Mac: Find and kill process
lsof -i :5000
kill -9 <PID>

# Windows: Use Task Manager or run
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

### "npm install fails"

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
rmdir /s /q node_modules & del package-lock.json  # Windows

# Reinstall
npm install
```

---

## 📊 Database Management

### View Data in MongoDB Atlas

1. Go to MongoDB Atlas website
2. Click on your cluster
3. Click "Collections"
4. Browse through:
   - `users` - All registered users
   - `pets` - All pet listings
   - `favorites` - User's favorite pets
   - `adoptionrequests` - All adoption applications

### Clear and Reseed Database

If you want to start fresh:

```bash
# Delete all data
cd server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');

(async () => {
  await connectDB();
  await mongoose.connection.dropDatabase();
  console.log('Database cleared!');
  process.exit(0);
})();
"

# Reseed with sample data
npm run seed  # or manual seed command
```

---

## 🚀 What's Next?

Congratulations! Your pet adoption platform is now running! 🎉

### Try These Features:

1. **Browse Pets** - Explore the 10 professional pets
2. **Register Account** - Create your own user profile
3. **Add Favorites** - Save your favorite pets
4. **Request Adoption** - Submit adoption applications
5. **View Profile** - See your adoption history
6. **Admin Features** (with admin account):
   - Add new pets
   - View all adoption requests
   - Manage application statuses

### Customization Ideas:

- Add your own pet data
- Customize colors and styling
- Add email notifications
- Implement payment processing
- Add pet photos from your device
- Create mobile app version

---

## 📚 Additional Resources

- **[Main README](../README.md)** - Project overview and features
- **[MongoDB Documentation](../MONGODB_README.md)** - Database architecture and queries
- **[Express.js Docs](https://expressjs.com/)** - Backend framework
- **[React Docs](https://react.dev/)** - Frontend framework
- **[MongoDB Atlas Guide](https://docs.mongodb.com/atlas/)** - Database management

---

## 💡 Tips for Success

1. **Keep terminals organized** - Use different terminals for backend/frontend
2. **Watch console for errors** - Check both Node.js and browser console for messages
3. **Use demo accounts first** - Test with provided credentials before creating new users
4. **Monitor MongoDB** - Watch usage in Atlas to understand how queries work
5. **Start small** - Browse pets before testing adoption features

---

## ❓ Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review **MONGODB_README.md** for database questions
3. Look at **browser console** (F12) for client-side errors
4. Look at **terminal output** for server-side errors
5. Verify all environment variables are set correctly

---

**Happy pet adopting! 🐾❤️**

*Help find these wonderful animals their forever homes!*

