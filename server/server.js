const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");
const app = express();
const petRoutes = require("./routes/pets");
const userRoutes = require("./routes/users");
const adoptionRoutes = require("./routes/adoptionRequests");
const favoriteRoutes = require("./routes/favorites");
app.use(cors());
app.use(express.json());
app.use("/api/pets", petRoutes);
app.get("/", (req, res) => {
    res.send("Pet Adoption Platform API is running!");
});

// Health check endpoint for Docker/Kubernetes
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Readiness probe for Kubernetes - checks database connection
app.get("/ready", async (req, res) => {
    try {
        // Quick MongoDB ping
        const db = require("mongoose").connection;
        if (db.readyState === 1) {
            res.status(200).json({ ready: true, database: "connected" });
        } else {
            res.status(503).json({ ready: false, database: "disconnected" });
        }
    } catch (error) {
        res.status(503).json({ ready: false, error: error.message });
    }
});

app.use("/api/adoption-requests", adoptionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoriteRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

startServer();
