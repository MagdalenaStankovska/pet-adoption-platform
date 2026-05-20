# 🐾 PawfectMatch - Pet Adoption Platform

![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-5.0+-green)
![React](https://img.shields.io/badge/react-%3E%3D18.0-blue)

A modern, professional pet adoption platform built with React, Express, and MongoDB. Browse adorable pets, submit adoption requests, and help animals find loving homes.

## ✨ Features

- 🐕 **Browse Pets** - Explore professionally curated pet listings with high-quality images
- ❤️ **Save Favorites** - Bookmark your favorite pets for quick access
- 📋 **Adoption Requests** - Submit and track adoption applications
- 👤 **User Profiles** - Manage your profile and adoption history
- 🎯 **Advanced Filtering** - Filter by pet category (Dogs, Cats, Birds) and search by name/breed
- 📊 **Admin Dashboard** - Add new pets and manage adoption requests (admin only)
- 🔐 **Secure Authentication** - User registration and login with password hashing
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations

## 📸 Screenshots

### Home Page
Welcoming landing page with call-to-action buttons and feature highlights.

### Pet Listings
Grid view of professionally photographed pets with search and filter functionality.

### Pet Details
Comprehensive pet profile with full information and adoption request buttons.

### User Dashboard
Personalized user profile showing adoption history and favorite pets.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory** (new terminal)
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React app**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

### Kubernetes Start

If you want to run the app on Kubernetes instead of Docker Compose, use:

```bash
bash kubernetes/deploy.sh pet-adoption
```

Then verify the deployment:

```bash
kubectl get all -n pet-adoption
```

If you are using a local cluster, you can open the frontend with:

```bash
kubectl port-forward -n pet-adoption svc/frontend-service 3000:80
```

For a step-by-step Kubernetes guide, see [KUBERNETES-STARTUP.md](./KUBERNETES-STARTUP.md).

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster
4. Add a database user with username and password
5. Get the connection string
6. Paste it into `server/.env` as `MONGO_URI`

**Example connection string:**
```
mongodb+srv://admin:MyPassword123@cluster0.abc123.mongodb.net/pet-adoption?retryWrites=true&w=majority
```

### Seed Database with Sample Data

Our project includes professional sample data with real pet information and images!

```bash
cd server
node -e "require('./utils/seedDatabase')().catch(console.error)" --require dotenv/config
```

**What gets seeded:**
- ✅ 10 professionally described pets with high-quality images
- ✅ 3 demo user accounts
- ✅ Sample adoption requests and favorites

**Demo Credentials:**
- Regular User: `john@example.com` / `password123`
- Admin User: `admin@example.com` / `admin123`

## 📚 Database Architecture

Our MongoDB database uses 4 main collections:

### 1. **Users Collection**
Stores user account information and authentication data.
```javascript
{
  id: 1,
  full_name: "John Doe",
  email: "john@example.com",
  password: "hashed_pwd",
  phone: "(555) 123-4567",
  role: "user" // or "admin"
}
```

### 2. **Pets Collection**
Contains all available pets with professional descriptions and images.
```javascript
{
  id: 1,
  name: "Max",
  age: 3,
  gender: "Male",
  category_id: 1, // 1=Dog, 2=Cat, 3=Bird
  breed: "Golden Retriever",
  description: "Friendly and energetic...",
  image_url: "https://...",
  health_status: "Excellent",
  adoption_status: "Available"
}
```

### 3. **Favorites Collection**
Junction collection linking users to their favorite pets.
```javascript
{
  id: 1,
  user_id: 1,
  pet_id: 5
}
```

### 4. **AdoptionRequests Collection**
Tracks all adoption applications.
```javascript
{
  id: 1,
  user_id: 2,
  pet_id: 8,
  status: "pending", // pending, approved, rejected
  request_date: ISODate(...)
}
```

### Data Persistence
- **Write Operations**: Data is immediately persisted to MongoDB's disk storage
- **User Registration**: When a user registers, their data is stored permanently in the database
- **Backups**: MongoDB Atlas provides automatic daily backups
- **Durability**: All writes are journaled before committing (crash-safe)

For detailed database documentation, see [MONGODB_README.md](./MONGODB_README.md)

## 📄 KIII Project Requirements Map

If you need a short explanation of **which file satisfies each KIII requirement**, open:

- [PROJECT-REQUIREMENTS-README.md](./NAJBITEN_README)
- [KUBERNETES-STARTUP.md](./KUBERNETES-STARTUP.md)

These two files explain:
- how to start the app with Kubernetes
- which file matches each 10%/20% project requirement
- how to prove the app works in a separate namespace

## 🔑 API Endpoints

### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create new pet (admin only)

### Users
- `POST /api/users/register` - Register new account
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile with adoption history

### Favorites
- `GET /api/favorites/:userId` - Get user's favorites
- `POST /api/favorites` - Add pet to favorites

### Adoption Requests
- `GET /api/adoption-requests` - Get all requests (admin)
- `POST /api/adoption-requests` - Submit adoption request
- `PUT /api/adoption-requests/:id` - Update request status (admin)

## 🛠️ Technology Stack

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **CSS3** - Styling with animations and gradients

### Backend
- **Express** - Node.js framework
- **Mongoose** - MongoDB ODM (Object Document Mapper)
- **Dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL document database
- **MongoDB Atlas** - Cloud database hosting

## 🎨 Design Features

- 🌈 Modern gradient color scheme (blues and pinks)
- ✨ Smooth animations and transitions
- 🔤 Professional typography with clear hierarchy
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎭 Interactive hover effects on cards
- 💫 Floating paw print decorations
- 🎯 Intuitive navigation and layout

## 🔐 Security

- ✅ Passwords hashed before database storage
- ✅ Unique email constraint prevents duplicates
- ✅ Passwords removed from API responses
- ✅ Compound unique indexes on relationships
- ✅ Environment variables for sensitive data
- ✅ CORS enabled for secure cross-origin requests

## 📖 Project Structure

```
pet-adoption-platform/
├── client/                    # React frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Header.js
│   │   │   ├── PetCard.js
│   │   │   └── ...
│   │   ├── pages/            # Page components
│   │   │   ├── Home.js
│   │   │   ├── Pets.js
│   │   │   ├── PetDetails.js
│   │   │   └── ...
│   │   ├── App.css           # Global styles
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Favorite.js
│   │   └── AdoptionRequest.js
│   ├── routes/               # API endpoints
│   │   ├── users.js
│   │   ├── pets.js
│   │   ├── favorites.js
│   │   └── adoptionRequests.js
│   ├── utils/
│   │   ├── mongoHelpers.js   # Database utilities
│   │   └── seedDatabase.js   # Sample data seeding
│   ├── db.js                 # MongoDB connection
│   ├── server.js             # Express app setup
│   ├── .env                  # Environment variables
│   └── package.json
│
├── MONGODB_README.md         # Database documentation
└── README.md                 # This file
```

## 🚦 Common Workflows

### User Registration and Login

1. User clicks "Get Started" on home page
2. Fills out registration form with name, email, password
3. Backend hashes password and creates user in MongoDB
4. User can now log in with email/password
5. User data stored in browser localStorage

### Finding and Adopting a Pet

1. User clicks "View Pets" to browse available animals
2. Uses search bar or category filter to narrow results
3. Clicks on pet card to view full details
4. Submits adoption request
5. Admin reviews request in dashboard
6. User can track request status in their profile

### Favoriting Pets

1. User clicks ❤️ "Save" button on pet card
2. Pet is added to favorites collection
3. User can view all favorites in dedicated page
4. Favorites persist even after logout

## 🐛 Troubleshooting

### "MongoDB Connection Error"
**Solution:**
- Verify `MONGO_URI` in `.env` is correct
- Check MongoDB Atlas IP whitelist includes your IP
- Ensure MongoDB cluster is running

### "Cannot find module 'mongoose'"
**Solution:**
```bash
cd server
npm install mongoose
```

### "Pets not loading"
**Solution:**
- Ensure backend server is running on port 5000
- Check browser console for API errors
- Verify database has pet data (run seed script)

### "E11000 Duplicate Key Error"
**Solution:**
- Clear data and reseed database: `node -e "require('./utils/seedDatabase')()" --require dotenv/config`
- Or manually delete duplicate entries in MongoDB Atlas

## 📋 Authentication Flow

1. **Registration**
   - User submits form with name, email, password
   - Backend checks email uniqueness
   - Password hashed with bcrypt
   - User created in MongoDB
   - Returns user object (without password)

2. **Login**
   - User submits email and password
   - Backend finds user by email
   - Compares provided password with hashed password
   - If match: returns user object, stored in localStorage
   - If no match: returns error

3. **Session Management**
   - User data persisted in browser localStorage
   - Frontend sends user.id with adoption/favorites requests
   - Backend validates user.id exists in database
   - Logout clears localStorage

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [REST API Best Practices](https://restfulapi.net/)

## 📊 Database Querying Examples

### Find all dogs
```javascript
const dogs = await Pet.find({ category_id: 1 });
```

### Find user's favorite pets
```javascript
const favorites = await Favorite.find({ user_id: 1 });
const pets = await Pet.find({ id: { $in: favorites.map(f => f.pet_id) } });
```

### Update adoption request status
```javascript
await AdoptionRequest.updateOne(
  { id: 1 },
  { status: "approved" }
);
```

### Get all pending adoption requests with user details
```javascript
const requests = await AdoptionRequest.find({ status: "pending" });
const enriched = await Promise.all(
  requests.map(async (req) => {
    const user = await User.findOne({ id: req.user_id });
    const pet = await Pet.findOne({ id: req.pet_id });
    return { request: req, user, pet };
  })
);
```

## 📞 Support

For issues, questions, or suggestions:
1. Check the troubleshooting section above
2. Review [MONGODB_README.md](./MONGODB_README.md) for database questions
3. Check browser console for error details
4. Verify all dependencies are installed

## 📜 License

MIT License - Feel free to use this project for learning and development.

## 🎉 Contributing

Contributions are welcome! Feel free to submit pull requests or report issues.

---

**Created with ❤️ for pet lovers everywhere** 🐾

*Help animals find their forever homes - Adopt, don't shop!*

