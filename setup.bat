@echo off
REM Pet Adoption Platform - Database Setup Script (Windows)
REM This script helps you setup MongoDB and seed the database

echo 🐾 === PawfectMatch Database Setup ===
echo.

REM Check if .env file exists
if not exist "server\.env" (
    echo ❌ Error: server\.env file not found!
    echo 📝 Please create server\.env file with the following content:
    echo.
    echo PORT=5000
    echo MONGO_URI=mongodb+srv://^<username^>:^<password^>@^<cluster-url^>/^<database^>?retryWrites=true^&w=majority
    echo.
    echo 📖 For MongoDB Atlas setup guide, see MONGODB_README.md
    pause
    exit /b 1
)

echo ✅ Found server\.env file
echo.

REM Check if node_modules exists
if not exist "server\node_modules" (
    echo 📦 Installing server dependencies...
    cd server
    call npm install
    cd ..
    echo ✅ Dependencies installed
    echo.
) else (
    echo ✅ Dependencies already installed
    echo.
)

echo 🌱 Seeding database with professional pet data...
echo.

REM Run seed script
cd server

node -e ^
"require('dotenv').config(); ^
const seedDatabase = require('./utils/seedDatabase'); ^
seedDatabase().then(() => { ^
    console.log(''); ^
    console.log('🎉 Database setup complete!'); ^
    console.log(''); ^
    console.log('🚀 You can now:'); ^
    console.log('   1. Start the backend: npm start'); ^
    console.log('   2. In another terminal, start frontend: cd ../client ^&^& npm start'); ^
    console.log(''); ^
    process.exit(0); ^
}).catch((error) => { ^
    console.error('❌ Seeding failed:', error.message); ^
    process.exit(1); ^
});"

if errorlevel 1 (
    echo.
    echo ❌ Failed to seed database
    echo 💡 Troubleshooting:
    echo    - Check your MONGO_URI in server\.env
    echo    - Ensure MongoDB Atlas cluster is running
    echo    - Check your IP is whitelisted in MongoDB Atlas
    cd ..
    pause
    exit /b 1
)

cd ..
pause

