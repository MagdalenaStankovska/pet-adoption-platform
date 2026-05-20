const mongoose = require("mongoose");
const { attachCleanJsonTransform } = require("../utils/mongoHelpers");

const userSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        full_name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        phone: { type: String, default: "" },
        role: { type: String, default: "user" }
    },
    { timestamps: true }
);

attachCleanJsonTransform(userSchema);

module.exports = mongoose.model("User", userSchema);

