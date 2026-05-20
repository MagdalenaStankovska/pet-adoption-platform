const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Pet = require("../models/Pet");
const AdoptionRequest = require("../models/AdoptionRequest");
const Notification = require("../models/Notification");
const { getNextNumericId } = require("../utils/mongoHelpers");

router.post("/register", async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            phone
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const id = await getNextNumericId(User);
        const newUser = await User.create({
            id,
            full_name,
            email,
            password,
            phone
        });

        const safeUser = newUser.toJSON();
        delete safeUser.password;

        res.status(201).json(safeUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const safeUser = user.toJSON();
        delete safeUser.password;

        res.json({
            message: "Login successful",
            user: safeUser
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.get("/profile/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const profile = await User.findOne({ id: userId });

        if (!profile) {
            return res.status(404).json({ message: "User not found" });
        }

        const requests = await AdoptionRequest.find({ user_id: userId }).sort({ id: -1 });
        const requestsWithPetNames = await Promise.all(
            requests.map(async (request) => {
                const pet = await Pet.findOne({ id: request.pet_id }).select("name");

                return {
                    id: request.id,
                    status: request.status,
                    request_date: request.request_date,
                    pet_name: pet ? pet.name : "Unknown Pet"
                };
            })
        );

        const safeProfile = profile.toJSON();
        delete safeProfile.password;

        res.json({
            user: safeProfile,
            requests: requestsWithPetNames
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get("/:id/notifications", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const notifications = await Notification.find({ user_id: userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.patch("/:id/notifications/:notificationId/read", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const notificationId = Number(req.params.notificationId);

        const updated = await Notification.findOneAndUpdate(
            { id: notificationId, user_id: userId },
            { $set: { is_read: true, read_at: new Date() } },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(updated);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;