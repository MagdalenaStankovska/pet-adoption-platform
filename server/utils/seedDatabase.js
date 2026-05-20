const mongoose = require("mongoose");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { getNextNumericId } = require("./mongoHelpers");

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Pet.deleteMany({});

        console.log("🗑️  Cleared existing data");

        // Seed professional pet data with high-quality images
        const petsData = [
            {
                name: "Max",
                age: 3,
                gender: "Male",
                category_id: 1, // Dog
                description: "A friendly and energetic Golden Retriever who loves outdoor activities and playing fetch. Perfect for active families.",
                image_url: "https://images.unsplash.com/photo-1633722715463-d30628519acd?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Golden Retriever",
                shelter_id: 1
            },
            {
                name: "Luna",
                age: 2,
                gender: "Female",
                category_id: 2, // Cat
                description: "A graceful and affectionate Siamese cat. Luna enjoys lounging in sunny spots and gentle play sessions.",
                image_url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Siamese",
                shelter_id: 1
            },
            {
                name: "Charlie",
                age: 4,
                gender: "Male",
                category_id: 1, // Dog
                description: "A well-trained Labrador Retriever with excellent temperament. Great with families and other pets.",
                image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Labrador Retriever",
                shelter_id: 1
            },
            {
                name: "Bella",
                age: 1,
                gender: "Female",
                category_id: 2, // Cat
                description: "A playful and curious British Shorthair kitten with a soft gray coat. Full of personality and love.",
                image_url: "https://images.unsplash.com/photo-1548681528-6a846cf17f30?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "British Shorthair",
                shelter_id: 1
            },
            {
                name: "Rocky",
                age: 5,
                gender: "Male",
                category_id: 1, // Dog
                description: "A strong and loyal German Shepherd. Trained and protective. Perfect companion for experienced dog owners.",
                image_url: "https://images.unsplash.com/photo-1568752433169-21b4f1f5bf25?w=500&h=500&fit=crop",
                health_status: "Good",
                adoption_status: "Available",
                breed: "German Shepherd",
                shelter_id: 2
            },
            {
                name: "Oliver",
                age: 3,
                gender: "Male",
                category_id: 2, // Cat
                description: "An independent and elegant tabby cat. Oliver enjoys peaceful environments and quiet companionship.",
                image_url: "https://images.unsplash.com/photo-1577854212614-3fb02fe626a7?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Tabby",
                shelter_id: 2
            },
            {
                name: "Daisy",
                age: 2,
                gender: "Female",
                category_id: 1, // Dog
                description: "A sweet and gentle Beagle. Loves walks, makes a perfect family pet. Great with children!",
                image_url: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Beagle",
                shelter_id: 1
            },
            {
                name: "Milo",
                age: 4,
                gender: "Male",
                category_id: 2, // Cat
                description: "A charming Maine Coon with stunning markings. Friendly and sociable. Loves interactive play.",
                image_url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Maine Coon",
                shelter_id: 2
            },
            {
                name: "Cooper",
                age: 3,
                gender: "Male",
                category_id: 1, // Dog
                description: "An intelligent and enthusiastic Poodle mix. Highly trainable and perfect for first-time owners.",
                image_url: "https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f4?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Poodle Mix",
                shelter_id: 1
            },
            {
                name: "Sophie",
                age: 1,
                gender: "Female",
                category_id: 2, // Cat
                description: "A playful and adventurous Bengal cat. Full of energy and love for interactive environments.",
                image_url: "https://images.unsplash.com/photo-1607208590750-b91d11e31dd0?w=500&h=500&fit=crop",
                health_status: "Excellent",
                adoption_status: "Available",
                breed: "Bengal",
                shelter_id: 1
            }
        ];

        // Create pets with auto-incremented IDs
        const createdPets = [];
        for (const petData of petsData) {
            const id = await getNextNumericId(Pet);
            const pet = await Pet.create({ id, ...petData });
            createdPets.push(pet);
        }
        console.log(`✅ Created ${createdPets.length} professional pets`);

        // Seed sample users
        const usersData = [
            {
                full_name: "John Anderson",
                email: "john@example.com",
                password: "password123",
                phone: "(555) 123-4567",
                role: "user"
            },
            {
                full_name: "Sarah Johnson",
                email: "sarah@example.com",
                password: "password123",
                phone: "(555) 987-6543",
                role: "user"
            },
            {
                full_name: "Admin User",
                email: "admin@example.com",
                password: "admin123",
                phone: "(555) 000-0000",
                role: "admin"
            }
        ];

        const createdUsers = [];
        for (const userData of usersData) {
            const id = await getNextNumericId(User);
            const user = await User.create({ id, ...userData });
            createdUsers.push(user);
        }
        console.log(`✅ Created ${createdUsers.length} demo users`);

        console.log("\n🎉 Database seeded successfully!");
        console.log("\n📋 Demo Credentials:");
        console.log("   Regular User: john@example.com / password123");
        console.log("   Admin User: admin@example.com / admin123");
        console.log("\n✨ Your database is ready with professional pet data!");

        return { success: true };
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        throw error;
    }
};

module.exports = seedDatabase;

