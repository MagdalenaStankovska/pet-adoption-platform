const mongoose = require("mongoose");
const { attachCleanJsonTransform } = require("../utils/mongoHelpers");

const notificationSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true, index: true },
        user_id: { type: Number, required: true, index: true },
        type: { type: String, default: "general" },
        message: { type: String, required: true },
        is_read: { type: Boolean, default: false },
        read_at: { type: Date, default: null },
        meta: { type: Object, default: {} }
    },
    { timestamps: true }
);

attachCleanJsonTransform(notificationSchema);

module.exports = mongoose.model("Notification", notificationSchema);

