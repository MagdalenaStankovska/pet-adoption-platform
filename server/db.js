const mongoose = require("mongoose");
require("dotenv").config();

// Simple sleep helper
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * connectDB - attempts to connect to MongoDB with retries and exponential backoff.
 * - Respects MONGO_CONNECT_TIMEOUT_MS (ms) env var, default 180000 (3 minutes)
 * - Uses short serverSelectionTimeoutMS so attempts fail fast on DNS issues
 */
const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Missing MONGO_URI. Add your MongoDB link in server/.env.");
    }

    const uriMasked = process.env.MONGO_URI.replace(/:[^:@]*@/, ":***@");
    const maxWait = parseInt(process.env.MONGO_CONNECT_TIMEOUT_MS, 10) || 180000; // 3 minutes default
    const start = Date.now();
    let attempt = 0;
    let delay = 2000; // start with 2s

    const options = {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: "majority",
        // useUnifiedTopology is default in modern mongoose, but explicit is harmless
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    console.log("Attempting to connect to MongoDB:", uriMasked);
    console.log(`Will retry for up to ${Math.round(maxWait / 1000)}s if the database is not available.`);

    while (Date.now() - start < maxWait) {
        attempt += 1;
        try {
            console.log(`MongoDB connect attempt #${attempt}...`);
            const conn = await mongoose.connect(process.env.MONGO_URI, options);
            console.log("✅ MongoDB connected successfully!");
            return conn;
        } catch (err) {
            const elapsed = Date.now() - start;
            console.error(`MongoDB connect attempt #${attempt} failed:`, err.message);
            if (elapsed + delay >= maxWait) {
                console.error(`Exceeded max wait time (${Math.round(maxWait / 1000)}s). Giving up.`);
                break;
            }
            console.log(`Retrying in ${Math.round(delay / 1000)}s... (elapsed ${Math.round(elapsed/1000)}s)`);
            // exponential backoff with cap
            await sleep(delay);
            delay = Math.min(delay * 2, 30000);
        }
    }

    const totalElapsed = Math.round((Date.now() - start) / 1000);
    const error = new Error(`Could not connect to MongoDB after ${totalElapsed}s and ${attempt} attempts`);
    console.error(error.message);
    throw error;
};

module.exports = connectDB;
