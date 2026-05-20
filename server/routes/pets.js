const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");
const { getNextNumericId } = require("../utils/mongoHelpers");

const requireAdmin = async (req, res) => {
    const adminId = Number(req.body?.admin_id || req.query?.admin_id);
    if (!adminId) {
        res.status(400).json({ message: "admin_id is required" });
        return null;
    }

    const adminUser = await User.findOne({ id: adminId });
    if (!adminUser || adminUser.role !== "admin") {
        res.status(403).json({ message: "Forbidden: admin privileges required" });
        return null;
    }

    return adminUser;
};

router.get("/", async (req, res) => {
    try {
        const pets = await Pet.find().sort({ id: 1 });
        res.json(pets);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.post("/", async (req, res) => {
    try {
        if (!(await requireAdmin(req, res))) return;

        const {
            name,
            age,
            gender,
            description,
            image_url,
            health_status,
            adoption_status,
            shelter_id,
            category_id
        } = req.body;

        const id = await getNextNumericId(Pet);
        const newPet = await Pet.create({
            id,
            name,
            age,
            gender,
            description,
            image_url,
            health_status,
            adoption_status,
            shelter_id,
            category_id
        });

        res.status(201).json(newPet);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        if (!(await requireAdmin(req, res))) return;

        const petId = Number(req.params.id);
        const deleted = await Pet.findOneAndDelete({ id: petId });

        if (!deleted) {
            return res.status(404).json({ message: "Pet not found" });
        }

        res.json({ message: "Pet deleted successfully", pet: deleted });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;