const mongoose = require("mongoose");
const { attachCleanJsonTransform } = require("../utils/mongoHelpers");

const favoriteSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        user_id: { type: Number, required: true, index: true },
        pet_id: { type: Number, required: true, index: true }
    },
    { timestamps: true }
);

favoriteSchema.index({ user_id: 1, pet_id: 1 }, { unique: true });
attachCleanJsonTransform(favoriteSchema);

module.exports = mongoose.model("Favorite", favoriteSchema);

