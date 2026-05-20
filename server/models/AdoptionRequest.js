const mongoose = require("mongoose");
const { attachCleanJsonTransform } = require("../utils/mongoHelpers");

const adoptionRequestSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        user_id: { type: Number, required: true, index: true },
        pet_id: { type: Number, required: true, index: true },
        status: { type: String, default: "pending" }, // pending, approved, rejected
        request_date: { type: Date, default: Date.now },
        
        // Adoption application details
        care_description: { type: String, default: "" }, // How they will care for the pet
        living_conditions: { type: String, default: "" }, // Description of living situation
        photo_urls: { type: [String], default: [] }, // Array of photo URLs showing home
        
        // Admin review details
        admin_notes: { type: String, default: "" }, // Admin comments/rejection reason
        reviewed_by: { type: Number, default: null }, // Admin user ID who reviewed
        reviewed_at: { type: Date, default: null } // When admin reviewed
    },
    { timestamps: true }
);

attachCleanJsonTransform(adoptionRequestSchema);

module.exports = mongoose.model("AdoptionRequest", adoptionRequestSchema);

