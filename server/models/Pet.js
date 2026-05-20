const mongoose = require("mongoose");
const { attachCleanJsonTransform } = require("../utils/mongoHelpers");

const petSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        name: { type: String, required: true },
        age: { type: Number, default: 0 },
        gender: { type: String, default: "" },
        breed: { type: String, default: "" },
        description: { type: String, default: "" },
        image_url: { type: String, default: "" },
        health_status: { type: String, default: "" },
        adoption_status: { type: String, default: "Available" },
        shelter_id: { type: Number, default: null },
        category_id: { type: Number, default: null }
    },
    { timestamps: true }
);

attachCleanJsonTransform(petSchema);

module.exports = mongoose.model("Pet", petSchema);

