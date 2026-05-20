const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite");
const Pet = require("../models/Pet");
const { getNextNumericId } = require("../utils/mongoHelpers");

router.post("/", async (req, res) => {
    try {
        const userId = Number(req.body.user_id);
        const petId = Number(req.body.pet_id);

        const existingFavorite = await Favorite.findOne({ user_id: userId, pet_id: petId });
        if (existingFavorite) {
            return res.json(existingFavorite);
        }

        const id = await getNextNumericId(Favorite);
        const favorite = await Favorite.create({
            id,
            user_id: userId,
            pet_id: petId
        });

        res.status(201).json(favorite);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.get("/:userId", async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const favorites = await Favorite.find({ user_id: userId }).sort({ id: -1 });
        const favoritePets = await Promise.all(
            favorites.map(async (favorite) => {
                return Pet.findOne({ id: favorite.pet_id });
            })
        );

        res.json(favoritePets.filter(Boolean));
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.delete("/", async (req, res) => {
    try {
        const userId = Number(req.body.user_id);
        const petId = Number(req.body.pet_id);

        await Favorite.deleteOne({ user_id: userId, pet_id: petId });

        res.json({
            message: "Removed from favorites"
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;