#!/bin/bash

# Pet Adoption Platform - Database Setup Script
# This script helps you set up MongoDB and seed the database with sample data

echo "🐾 === PawfectMatch Database Setup ==="
echo ""

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "❌ Error: server/.env file not found!"
    echo "📝 Please create server/.env file with the following content:"
    echo ""
    echo "PORT=5000"
    echo "MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority"
    echo ""
    echo "📖 For MongoDB Atlas setup guide, see MONGODB_README.md"
    exit 1
fi

# Check if MONGO_URI is set
if ! grep -q "MONGO_URI=" "server/.env"; then
    echo "❌ Error: MONGO_URI not found in server/.env"
    exit 1
fi

# Check if MONGO_URI is empty
MONGO_URI=$(grep "^MONGO_URI=.*mongodb" "server/.env")
if [ -z "$MONGO_URI" ]; then
    echo "❌ Error: MONGO_URI is empty or invalid in server/.env"
    echo "📝 Please add your MongoDB connection string"
    exit 1
fi

echo "✅ Found valid MONGO_URI in .env"
echo ""

# Install server dependencies if needed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server
    npm install
    cd ..
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🌱 Seeding database with professional pet data..."
echo ""

# Run seed script
cd server
node -e "
require('dotenv').config();
const seedDatabase = require('./utils/seedDatabase');
seedDatabase().then(() => {
    console.log('');
    console.log('🎉 Database setup complete!');
    console.log('');
    console.log('🚀 You can now:');
    console.log('   1. Start the backend: npm start');
    console.log('   2. In another terminal, start frontend: cd ../client && npm start');
    console.log('');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
});
" || {
    echo "❌ Failed to seed database"
    echo "💡 Troubleshooting:"
    echo "   - Check your MONGO_URI in server/.env"
    echo "   - Ensure MongoDB Atlas cluster is running"
    echo "   - Check your IP is whitelisted in MongoDB Atlas"
    exit 1
}

