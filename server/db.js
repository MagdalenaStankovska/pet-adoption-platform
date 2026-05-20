const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Missing MONGO_URI. Add your MongoDB link in server/.env.");
    }

    await mongoose.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
