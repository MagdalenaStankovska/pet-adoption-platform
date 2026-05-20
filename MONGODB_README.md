# MongoDB Database Documentation

## 📚 Overview

This pet adoption platform uses **MongoDB** as its primary database. MongoDB is a NoSQL document-oriented database that stores data in flexible, JSON-like documents called BSON (Binary JSON). This document explains how our database works, how data persists, and the structure of our collections.

## 🏗️ Database Architecture

### Collections

Our MongoDB database contains 4 main collections:

#### 1. **Users Collection**
Stores user account information and authentication data.

```javascript
{
  id: 1,                    // Numeric ID (auto-increment)
  full_name: "John Doe",    // User's full name
  email: "john@example.com", // Unique email for login
  password: "hashed_pwd",   // Password (hashed by bcrypt)
  phone: "(555) 123-4567",  // Contact number
  role: "user",             // "user" or "admin"
  createdAt: ISODate(...),  // Timestamp when account created
  updatedAt: ISODate(...)   // Timestamp when last updated
}
```

**Key Features:**
- Unique email index (prevents duplicate accounts)
- Numeric `id` field (preserved for API compatibility)
- Timestamps auto-tracked by Mongoose
- Passwords hashed before storage (security best practice)

---

#### 2. **Pets Collection**
Contains information about all available pets for adoption.

```javascript
{
  id: 1,                              // Numeric ID (auto-increment)
  name: "Max",                        // Pet's name
  age: 3,                             // Age in years
  gender: "Male",                     // "Male" or "Female"
  category_id: 1,                     // 1=Dog, 2=Cat, 3=Bird
  breed: "Golden Retriever",          // Pet breed
  description: "Friendly and energetic...", // Detailed description
  image_url: "https://...",           // High-quality image URL
  health_status: "Excellent",         // Health condition
  adoption_status: "Available",       // "Available" or "Adopted"
  shelter_id: 1,                      // Which shelter has pet
  createdAt: ISODate(...),            // When added to system
  updatedAt: ISODate(...)             // Last profile update
}
```

**Key Features:**
- Professional images from Unsplash (free high-quality photos)
- Descriptions matched to breed characteristics
- Health and adoption status tracked
- Category system for filtering (Dogs, Cats, Birds)

---

#### 3. **Favorites Collection**
Junction collection linking users to their favorite pets.

```javascript
{
  id: 1,                    // Numeric ID (auto-increment)
  user_id: 1,               // Reference to user
  pet_id: 5,                // Reference to pet
  createdAt: ISODate(...),  // When favorited
  updatedAt: ISODate(...)
}
```

**Key Features:**
- **Compound unique index on (user_id, pet_id)** - ensures a user can't favorite the same pet twice
- Allows users to save pets for quick access later
- Simple structure optimized for fast queries

---

#### 4. **AdoptionRequests Collection**
Tracks all adoption requests submitted by users.

```javascript
{
  id: 1,                           // Numeric ID (auto-increment)
  user_id: 2,                      // User requesting adoption
  pet_id: 8,                       // Pet being requested
  status: "pending",               // "pending", "approved", "rejected"
  request_date: ISODate(...),      // When request submitted
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

**Key Features:**
- Stores relationship between users and adoption requests
- Status workflow: pending → approved/rejected
- Request date for audit trail
- Admins can manage requests from dashboard

---

## 💾 Data Persistence Explained

### How MongoDB Stores Data

1. **Write Operations:**
   - When a user registers, a new document is created in the `users` collection
   - MongoDB assigns an internal `_id` field (ObjectId)
   - Our API also maintains numeric `id` field for backward compatibility
   - Data is **immediately persisted** to disk

2. **Read Operations:**
   - Queries are fast due to MongoDB's indexing on `id`, `email`, `user_id` fields
   - Data returns exactly as stored without any transformation

3. **Durability:**
   - MongoDB uses a **write-ahead log** - all writes are journaled before committing
   - Even if the server crashes, committed data is safe
   - Your MongoDB connection URI determines the cluster location

### Example: User Registration Flow

```
┌─────────────────────────────────────────────────┐
│  1. User fills registration form                │
│     Name: "Alice", Email: "alice@example.com"  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  2. Frontend sends POST /api/users/register    │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  3. Backend validates email not in use         │
│     - Queries: User.findOne({ email })         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  4. Generate next numeric ID                   │
│     - Finds max existing id and adds 1         │
│     - Result: id = 3                           │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  5. Create user document in MongoDB            │
│     User.create({                              │
│       id: 3,                                   │
│       full_name: "Alice",                      │
│       email: "alice@example.com",              │
│       password: "hashed_pwd",                  │
│       ...                                      │
│     })                                         │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  6. Data PERSISTED to MongoDB                  │
│     ✅ Stored in users collection             │
│     ✅ Indexed by email for fast lookup        │
│     ✅ Safely journaled to disk                │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  7. Return user object to frontend             │
│     (Password field removed for security)      │
└─────────────────────────────────────────────────┘
```

## 🔑 Indexes for Performance

MongoDB uses indexes to speed up queries. Our collections have:

| Collection | Indexed Fields | Purpose |
|-----------|----------------|---------|
| Users | `id`, `email` | Fast user lookups during login/registration |
| Pets | `id`, `category_id` | Fast pet queries and filtering |
| Favorites | `user_id`, `pet_id` (compound) | Quick favorite list retrieval |
| AdoptionRequests | `user_id`, `pet_id` | Fast request queries |

## 🔐 Security Features

### 1. **Passwords Never Stored in Plaintext**
- Passwords are hashed before storage
- Failed login attempts are checked against hashes
- Backend removes password field from all API responses

### 2. **Unique Email Constraint**
- MongoDB enforces unique index on email
- Prevents duplicate user accounts
- Bad registrations are rejected at database level

### 3. **Compound Unique Index on Favorites**
- Prevents users from favoriting same pet multiple times
- Database rejects duplicate favorites automatically

## 🚀 Environment Setup

### .env Configuration

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pet-adoption?retryWrites=true&w=majority
```

### Connection String Explained

```
mongodb+srv://  ← Protocol (secure connection)
username        ← MongoDB Atlas user
:password       ← Password for that user
@cluster        ← Your MongoDB Atlas cluster
/pet-adoption   ← Database name
?retryWrites=true&w=majority ← Settings for reliability
```

## 📋 Seeding the Database

### Automatic Seeding

When you first setup the project and start the server with professional seed data:

```bash
cd server
npm install
node seedData.js  # Optional: run this to populate with demo data
npm start
```

### What Gets Seeded

- **10 professional pets** with realistic descriptions and high-quality images
- **3 demo user accounts**:
  - `john@example.com` / `password123` (regular user)
  - `sarah@example.com` / `password123` (regular user)
  - `admin@example.com` / `admin123` (admin user)

## 📊 Querying Data

### Getting Registered Users Count
```javascript
// Backend code example
const userCount = await User.countDocuments({});
```

### Finding Users in Database
```javascript
// Find user by email
const user = await User.findOne({ email: "john@example.com" });

// Find user by numeric ID
const user = await User.findOne({ id: 1 });

// Find all users
const allUsers = await User.find({});
```

### Finding Pets by Category
```javascript
// Find all dogs (category_id = 1)
const dogs = await Pet.find({ category_id: 1 });

// Find available pets only
const available = await Pet.find({ adoption_status: "Available" });
```

### Finding User's Favorites
```javascript
// Get favorites for user 1
const favorites = await Favorite.find({ user_id: 1 });

// Get pets from favorites
const petIds = favorites.map(f => f.pet_id);
const favoPets = await Pet.find({ id: { $in: petIds } });
```

### Getting Adoption Requests with Details
```javascript
// Find pending requests
const pending = await AdoptionRequest.find({ status: "pending" });

// Enrich with user and pet names
const enriched = await Promise.all(
  pending.map(async (req) => {
    const user = await User.findOne({ id: req.user_id });
    const pet = await Pet.findOne({ id: req.pet_id });
    return {
      id: req.id,
      user_name: user.full_name,
      pet_name: pet.name,
      status: req.status
    };
  })
);
```

## 🔄 Data Flow Diagram

```
┌──────────────┐
│  React App   │ (Frontend)
│  localhost   │
└──────┬───────┘
       │ HTTP Requests
       │ (JSON payloads)
       ▼
┌──────────────────────────┐
│  Express Backend         │ 
│  localhost:5000          │
│  /api/pets               │
│  /api/users              │
│  /api/favorites          │
│  /api/adoption-requests  │
└──────┬───────────────────┘
       │ Mongoose Queries
       │ (JavaScript)
       ▼
┌──────────────────────────┐
│  MongoDB Driver          │
│  (Connection to Atlas)   │
└──────┬───────────────────┘
       │ BSON Serialization
       │ (Binary protocol)
       ▼
┌──────────────────────────┐
│  MongoDB Atlas Cluster   │
│  Cloud Servers           │
│  Persistent Storage      │
│  Backups & Replication   │
└──────────────────────────┘
```

## 📈 Scaling Considerations

### Current Setup
- Single MongoDB cluster (shared free tier or basic paid tier)
- Suitable for development and testing
- Can handle thousands of users

### Future Scaling
- **Vertical Scaling**: Upgrade MongoDB cluster tier for more resources
- **Horizontal Scaling**: Implement sharding to distribute data across servers
- **Caching Layer**: Add Redis cache for frequently accessed pets
- **Search Optimization**: Use MongoDB text indexes or Elasticsearch for advanced search

## ❓ FAQ

**Q: Where is my data stored?**
A: In MongoDB Atlas cloud servers. The exact location depends on your connection string (AWS, GCP, Azure regions available).

**Q: Is my data safe?**
A: Yes! MongoDB Atlas provides:
- Automatic backups (default: daily)
- Replication across multiple servers
- Encryption in transit and at rest
- 99.99% uptime SLA

**Q: Can I backup my data?**
A: Yes! MongoDB Atlas has built-in backup and restore functionality.

**Q: How do I monitor my database?**
A: MongoDB Atlas provides:
- Performance charts
- Query metrics
- Storage usage
- Connection stats

**Q: Can I use a local MongoDB instead?**
A: Yes! Just update `MONGO_URI` to `mongodb://localhost:27017/pet-adoption` and install MongoDB locally.

## 📞 Troubleshooting

### "MongooseServerSelectionError"
- **Cause**: Invalid connection string or network issue
- **Fix**: Verify `MONGO_URI` in `.env` file and check MongoDB Atlas whitelist IP

### "E11000 duplicate key error"
- **Cause**: Trying to insert duplicate email or favorite
- **Fix**: Check if user/favorite already exists before creating

### "ValidationError"
- **Cause**: Missing required fields
- **Fix**: Ensure all required fields are provided in API requests

## 🎓 Learning Resources

- [MongoDB Official Docs](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Tutorial](https://www.mongodb.com/cloud/atlas)

---

**Last Updated**: May 2026
**Database Version**: MongoDB 5.0+
**Mongoose Version**: 8.23.1+

