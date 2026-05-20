const express = require("express");
const router = express.Router();
const AdoptionRequest = require("../models/AdoptionRequest");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Notification = require("../models/Notification");
const { getNextNumericId } = require("../utils/mongoHelpers");

// Create adoption request with application details
router.post("/", async (req, res) => {
    try {
        const userId = Number(req.body.user_id);
        const petId = Number(req.body.pet_id);
        const { care_description, living_conditions, photo_urls } = req.body;

        // Check if request already exists
        const existingRequest = await AdoptionRequest.findOne({ 
            user_id: userId, 
            pet_id: petId,
            status: { $in: ["pending", "approved"] }
        });
        
        if (existingRequest) {
            return res.status(409).json({ message: "You already have an active request for this pet" });
        }

        const id = await getNextNumericId(AdoptionRequest);
        const newRequest = await AdoptionRequest.create({
            id,
            user_id: userId,
            pet_id: petId,
            care_description: care_description || "",
            living_conditions: living_conditions || "",
            photo_urls: photo_urls || []
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get all adoption requests (admin view)
router.get("/", async (req, res) => {
    try {
        const requests = await AdoptionRequest.find().sort({ request_date: -1 });
        const enrichedRequests = await Promise.all(
            requests.map(async (request) => {
                const [user, pet, reviewer] = await Promise.all([
                    User.findOne({ id: request.user_id }).select("full_name email phone"),
                    Pet.findOne({ id: request.pet_id }).select("name breed image_url"),
                    request.reviewed_by ? User.findOne({ id: request.reviewed_by }).select("full_name") : null
                ]);

                return {
                    id: request.id,
                    status: request.status,
                    request_date: request.request_date,
                    reviewed_at: request.reviewed_at,
                    care_description: request.care_description,
                    living_conditions: request.living_conditions,
                    photo_urls: request.photo_urls,
                    admin_notes: request.admin_notes,
                    user: {
                        id: request.user_id,
                        full_name: user ? user.full_name : "Unknown User",
                        email: user?.email,
                        phone: user?.phone
                    },
                    pet: {
                        id: request.pet_id,
                        name: pet ? pet.name : "Unknown Pet",
                        breed: pet?.breed,
                        image: pet?.image_url
                    },
                    reviewed_by: reviewer?.full_name || null
                };
            })
        );

        res.json(enrichedRequests);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Get single adoption request with full details
router.get("/:requestId", async (req, res) => {
    try {
        const requestId = Number(req.params.requestId);
        const request = await AdoptionRequest.findOne({ id: requestId });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        const [user, pet] = await Promise.all([
            User.findOne({ id: request.user_id }).select("full_name email phone"),
            Pet.findOne({ id: request.pet_id }).select("name breed image_url description health_status")
        ]);

        res.json({
            id: request.id,
            status: request.status,
            request_date: request.request_date,
            care_description: request.care_description,
            living_conditions: request.living_conditions,
            photo_urls: request.photo_urls,
            admin_notes: request.admin_notes,
            reviewed_at: request.reviewed_at,
            user: {
                id: request.user_id,
                full_name: user?.full_name,
                email: user?.email,
                phone: user?.phone
            },
            pet: {
                id: request.pet_id,
                name: pet?.name,
                breed: pet?.breed,
                image_url: pet?.image_url,
                description: pet?.description,
                health_status: pet?.health_status
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Update adoption request status (admin only)
router.put("/:id", async (req, res) => {
    try {
        const { status, admin_notes, admin_id } = req.body;
        const id = Number(req.params.id);

        // Validate status
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Ensure admin_id is provided and refers to an admin user
        if (!admin_id) {
            return res.status(400).json({ message: "admin_id is required" });
        }

        const adminUser = await User.findOne({ id: Number(admin_id) });
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: admin privileges required" });
        }

        const updateData = {
            status,
            reviewed_at: new Date(),
            reviewed_by: adminUser.id
        };

        if (admin_notes) {
            updateData.admin_notes = admin_notes;
        }

        const updated = await AdoptionRequest.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Send notification to the applicant when a request is approved/rejected.
        if (["approved", "rejected"].includes(status)) {
            const pet = await Pet.findOne({ id: updated.pet_id }).select("name");
            const notificationId = await getNextNumericId(Notification);
            const adminMessage = admin_notes ? ` Message from admin: ${admin_notes}` : "";
            const message = `Your adoption application for ${pet?.name || "the selected pet"} was ${status}.${adminMessage}`;

            await Notification.create({
                id: notificationId,
                user_id: updated.user_id,
                type: "adoption_status",
                message,
                meta: {
                    request_id: updated.id,
                    pet_id: updated.pet_id,
                    status,
                    reviewed_by: adminUser.id
                }
            });
        }

        res.json({
            message: `Request ${status} successfully`,
            request: updated
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;