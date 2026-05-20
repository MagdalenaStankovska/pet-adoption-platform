# 📖 API Reference & Developer Guide

Quick reference for developers working on the PawfectMatch project.

## 🔗 API Base URL

```
http://localhost:5000/api
```

---

## 👥 Users API

### Register User

**POST** `/users/register`

Creates a new user account.

**Request:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password123",
  "phone": "(555) 123-4567"
}
```

**Response (201 - Created):**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "role": "user"
}
```

**Errors:**
- `400` - Missing required fields
- `409` - Email already registered

---

### Login User

**POST** `/users/login`

Authenticates user and returns their information.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure_password123"
}
```

**Response (200 - OK):**
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "role": "user"
}
```

**Errors:**
- `400` - Missing email or password
- `404` - User not found
- `401` - Invalid password

---

### Get User Profile

**GET** `/users/profile/:id`

Retrieves user profile with adoption request history.

**Response (200 - OK):**
```json
{
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "role": "user"
  },
  "requests": [
    {
      "id": 5,
      "status": "pending",
      "pet_name": "Max"
    },
    {
      "id": 3,
      "status": "approved",
      "pet_name": "Luna"
    }
  ]
}
```

---

## 🐾 Pets API

### Get All Pets

**GET** `/pets`

Retrieves all available pets.

**Query Parameters:**
- `category` (optional): Filter by type (1=Dog, 2=Cat, 3=Bird)
- `status` (optional): "Available" or "Adopted"

**Response (200 - OK):**
```json
[
  {
    "id": 1,
    "name": "Max",
    "age": 3,
    "gender": "Male",
    "breed": "Golden Retriever",
    "category_id": 1,
    "description": "Friendly and energetic...",
    "image_url": "https://...",
    "health_status": "Excellent",
    "adoption_status": "Available",
    "shelter_id": 1
  }
]
```

---

### Add New Pet (Admin Only)

**POST** `/pets`

Adds a new pet to the system.

**Request:**
```json
{
  "name": "Charlie",
  "age": 2,
  "gender": "Male",
  "breed": "Labrador",
  "category_id": 1,
  "description": "Friendly and well-trained...",
  "image_url": "https://images.unsplash.com/...",
  "health_status": "Excellent",
  "adoption_status": "Available",
  "shelter_id": 1
}
```

**Response (201 - Created):**
```json
{
  "id": 11,
  "name": "Charlie",
  "age": 2,
  "gender": "Male",
  ...
}
```

**Errors:**
- `401` - Admin access required
- `400` - Missing required fields

---

## ❤️ Favorites API

### Get User's Favorites

**GET** `/favorites/:userId`

Retrieves all favorite pets for a specific user.

**Response (200 - OK):**
```json
[
  {
    "id": 1,
    "name": "Max",
    "breed": "Golden Retriever",
    "image_url": "https://...",
    ...
  },
  {
    "id": 5,
    "name": "Luna",
    "breed": "Siamese",
    "image_url": "https://...",
    ...
  }
]
```

---

### Add Pet to Favorites

**POST** `/favorites`

Saves a pet as a favorite.

**Request:**
```json
{
  "user_id": 1,
  "pet_id": 3
}
```

**Response (201 - Created):**
```json
{
  "id": 12,
  "user_id": 1,
  "pet_id": 3
}
```

**Errors:**
- `400` - User or pet not found
- `409` - Pet already in favorites

---

## 📋 Adoption Requests API

### Get All Adoption Requests (Admin Only)

**GET** `/adoption-requests`

List all adoption requests with user and pet details.

**Response (200 - OK):**
```json
[
  {
    "id": 1,
    "status": "pending",
    "user_id": 2,
    "pet_id": 5,
    "full_name": "John Doe",
    "pet_name": "Max",
    "request_date": "2024-05-14T10:30:00.000Z"
  },
  {
    "id": 2,
    "status": "approved",
    "user_id": 3,
    "pet_id": 8,
    "full_name": "Sarah Johnson",
    "pet_name": "Luna",
    "request_date": "2024-05-13T14:15:00.000Z"
  }
]
```

---

### Submit Adoption Request

**POST** `/adoption-requests`

Users submit a request to adopt a pet.

**Request:**
```json
{
  "user_id": 1,
  "pet_id": 5
}
```

**Response (201 - Created):**
```json
{
  "id": 15,
  "user_id": 1,
  "pet_id": 5,
  "status": "pending",
  "request_date": "2024-05-14T10:30:00.000Z"
}
```

**Errors:**
- `400` - User or pet not found
- `409` - Request already exists

---

### Update Adoption Request Status (Admin Only)

**PUT** `/adoption-requests/:id`

Admin approves or rejects adoption requests.

**Request:**
```json
{
  "status": "approved"
}
```

**Valid Status Values:**
- `pending` - Initial status
- `approved` - Pet approved for adoption
- `rejected` - Request denied

**Response (200 - OK):**
```json
{
  "id": 15,
  "status": "approved",
  "user_id": 1,
  "pet_id": 5,
  ...
}
```

---

## 🏗️ Project Structure

```
pet-adoption-platform/
│
├── server/
│   ├── models/
│   │   ├── User.js          # User schema: id, full_name, email, password, phone, role
│   │   ├── Pet.js           # Pet schema: id, name, age, gender, breed, image_url, health_status, etc.
│   │   ├── Favorite.js      # Favorite schema: id, user_id, pet_id (compound unique index)
│   │   └── AdoptionRequest.js # Request schema: id, user_id, pet_id, status, request_date
│   │
│   ├── routes/
│   │   ├── users.js         # User registration, login, profile endpoints
│   │   ├── pets.js          # Pet CRUD endpoints
│   │   ├── favorites.js     # Favorite management
│   │   └── adoptionRequests.js # Request management
│   │
│   ├── utils/
│   │   ├── mongoHelpers.js   # Database utilities (getNextNumericId, attachCleanJsonTransform)
│   │   └── seedDatabase.js   # Sample data seeding
│   │
│   ├── db.js                # MongoDB connection function
│   ├── server.js            # Express app initialization
│   ├── .env                 # Environment variables (PORT, MONGO_URI)
│   └── package.json         # Dependencies: express, mongoose, cors, dotenv
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js    # Navigation header with user info
│   │   │   ├── PetCard.js   # Pet listing card component
│   │   │   ├── SearchBar.js # Search functionality
│   │   │   └── FilterBar.js # Category filter
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js                 # Landing page
│   │   │   ├── Pets.js                 # Pet listings with filters
│   │   │   ├── PetDetails.js           # Individual pet details
│   │   │   ├── Login.js                # User login
│   │   │   ├── Register.js             # User registration
│   │   │   ├── Profile.js              # User profile & adoption history
│   │   │   ├── Favorites.js            # Saved favorite pets
│   │   │   ├── AddPet.js               # Admin: add new pet
│   │   │   ├── AdminDashboard.js       # Admin: manage adoption requests
│   │   │   └── AdoptionForm.js         # Adoption request form
│   │   │
│   │   ├── App.js           # Main app component with routing
│   │   ├── App.css          # Global styles
│   │   └── index.js         # React entry point
│   │
│   └── package.json         # Dependencies: react, react-router-dom
│
├── README.md                # Project overview
├── SETUP_GUIDE.md           # Step-by-step setup instructions
├── MONGODB_README.md        # Database architecture & documentation
├── API_REFERENCE.md         # This file
├── setup.sh                 # Setup script (Mac/Linux)
└── setup.bat                # Setup script (Windows)
```

---

## 🔐 Data Models

### User Schema

```javascript
{
  id: { type: Number, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  phone: { type: String, default: "" },
  role: { type: String, default: "user" }, // "user" or "admin"
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Pet Schema

```javascript
{
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  gender: { type: String }, // "Male" or "Female"
  breed: { type: String },
  category_id: { type: Number }, // 1=Dog, 2=Cat, 3=Bird
  description: { type: String },
  image_url: { type: String },
  health_status: { type: String }, // "Excellent", "Good", etc.
  adoption_status: { type: String, default: "Available" },
  shelter_id: { type: Number },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Favorite Schema

```javascript
{
  id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true, index: true },
  pet_id: { type: Number, required: true, index: true },
  createdAt: ISODate,
  updatedAt: ISODate
  // Compound unique index: (user_id, pet_id)
}
```

### AdoptionRequest Schema

```javascript
{
  id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true, index: true },
  pet_id: { type: Number, required: true, index: true },
  status: { type: String, default: "pending" }, // pending, approved, rejected
  request_date: { type: Date, default: Date.now },
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## 🔄 Common API Workflows

### Workflow 1: User Registration & Login

```
1. POST /users/register
   Request: { full_name, email, password, phone }
   Response: { id, full_name, email, phone, role }

2. User stores response in localStorage

3. POST /users/login
   Request: { email, password }
   Response: { id, full_name, email, phone, role }

4. User stored in browser for authenticated requests
```

### Workflow 2: Browse & Adopt Pet

```
1. GET /pets
   Response: Array of all pets

2. Click pet card → GET /pets (find specific pet)
   Or use PetDetails component

3. POST /adoption-requests
   Request: { user_id, pet_id }
   Response: { id, status: "pending", ... }

4. User notified adoption request submitted

5. GET /users/profile/:id
   Shows adoption request in "status: pending"

6. Admin sees in GET /adoption-requests

7. Admin updates: PUT /adoption-requests/:id
   Request: { status: "approved" }
   Response: Updated request object
```

### Workflow 3: Save & View Favorites

```
1. POST /favorites
   Request: { user_id, pet_id }
   Response: { id, user_id, pet_id }

2. Pet added to favorites

3. GET /favorites/:userId
   Response: Array of favorite pet objects

4. Display in favorites page
```

---

## 🧪 Testing API Endpoints

### Using curl

```bash
# Get all pets
curl http://localhost:5000/api/pets

# Register new user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "(555) 987-6543"
  }'

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Using Postman

1. Install [Postman](https://www.postman.com/downloads/)
2. Create a new collection "Pet Adoption API"
3. Add requests for each endpoint
4. Store user ID in variables for authenticated requests
5. Test all CRUD operations

### Using Visual Studio Code REST Client

Install the REST Client extension, then create a file `test.http`:

```http
### Get all pets
GET http://localhost:5000/api/pets

### Register new user
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "full_name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "(555) 111-2222"
}

### Login
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🔌 Mongoose Connection Info

The project uses Mongoose for MongoDB connection.

### Connection Details

- **Host**: MongoDB Atlas (cloud)
- **Port**: 27017 (default, embedded in connection string)
- **Database**: `pet-adoption`
- **Collections**: `users`, `pets`, `favorites`, `adoptionrequests`

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

---

## 📊 Database Indexes

For best performance, these indexes are created automatically:

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| users | id | Unique | Fast user lookup by ID |
| users | email | Unique | Prevent duplicate emails |
| pets | id | Unique | Fast pet lookup |
| pets | category_id | Regular | Filter by pet type |
| favorites | (user_id, pet_id) | Compound Unique | Prevent duplicate favorites |
| adoptionrequests | user_id | Regular | Find user's requests |
| adoptionrequests | pet_id | Regular | Find requests for pet |

---

## 🚨 Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body, verify all required fields |
| 401 | Unauthorized | Login first, admin endpoint requires admin role |
| 404 | Not Found | User/Pet/Request doesn't exist |
| 409 | Conflict | Email already registered, favorite already exists |
| 500 | Server Error | Check server logs, database connection issues |
| 503 | Service Unavailable | MongoDB connection issue, server is down |

---

## 💡 Development Tips

1. **Test with demo data first** - Use seeded accounts before creating new ones
2. **Check browser console** - F12 to see client-side errors
3. **Check server logs** - Terminal running `npm start` shows server errors
4. **Use Postman** - Test API without frontend to debug issues
5. **Monitor MongoDB** - Watch Atlas console to see data changes in real-time
6. **Enable request logging** - Add `console.log(req.body)` in route handlers
7. **Use VS Code REST Client** - Quick testing without leaving your editor

---

## 🔗 Related Documentation

- [Main README](./README.md) - Project overview
- [MongoDB Documentation](./MONGODB_README.md) - Database guide
- [Setup Guide](./SETUP_GUIDE.md) - Installation instructions
- [Express Docs](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Docs](https://react.dev/)

---

**Last Updated**: May 2026
**API Version**: 1.0
**Status**: Production Ready ✅

