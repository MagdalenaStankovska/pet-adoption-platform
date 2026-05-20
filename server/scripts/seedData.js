const mongoose = require("mongoose");
require("dotenv").config();
const Pet = require("../models/Pet");
const User = require("../models/User");
const { getNextNumericId } = require("../utils/mongoHelpers");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("Missing MONGO_URI. Add your MongoDB link in server/.env.");
    }
    await mongoose.connect(process.env.MONGO_URI);
};

const seedPets = async () => {
    console.log("🐾 Seeding pets...");
    
    const petsData = [
        {
            name: "Max",
            age: 2,
            gender: "Male",
            description: "Friendly Golden Retriever who loves playing fetch and swimming!",
            image_url: "https://images.unsplash.com/photo-1633722715463-d30628519e83?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 1
        },
        {
            name: "Luna",
            age: 1,
            gender: "Female",
            description: "Energetic husky puppy with blue eyes. Very playful and social!",
            image_url: "https://images.unsplash.com/photo-1606214174585-fe31a7d14f2d?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 1
        },
        {
            name: "Whiskers",
            age: 3,
            gender: "Male",
            description: "Calm orange tabby cat. Perfect for apartment living!",
            image_url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 2
        },
        {
            name: "Mittens",
            age: 2,
            gender: "Female",
            description: "Sweet black and white cat. Loves cuddles and lap time!",
            image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 2
        },
        {
            name: "Charlie",
            age: 4,
            gender: "Male",
            description: "Gentle German Shepherd. Great with families and kids!",
            image_url: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 1
        },
        {
            name: "Bella",
            age: 1,
            gender: "Female",
            description: "Adorable Beagle puppy. Full of energy and very affectionate!",
            image_url: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 1
        },
        {
            name: "Shadow",
            age: 5,
            gender: "Male",
            description: "Bold black cat with striking yellow eyes. Independent but friendly!",
            image_url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 2
        },
        {
            name: "Daisy",
            age: 3,
            gender: "Female",
            description: "Beautiful Labrador Retriever. Loves water and outdoor adventures!",
            image_url: "https://images.unsplash.com/photo-1537151608828-8201c5734df1?w=500",
            health_status: "Healthy",
            adoption_status: "Available",
            category_id: 1
        }
    ];

    try {
        for (const petData of petsData) {
            const existingPet = await Pet.findOne({ name: petData.name });
            if (!existingPet) {
                const id = await getNextNumericId(Pet);
                await Pet.create({ ...petData, id });
                console.log(`✅ Added pet: ${petData.name}`);
            } else {
                console.log(`⏭️  Pet already exists: ${petData.name}`);
            }
        }
    } catch (error) {
        console.error("Error seeding pets:", error);
    }
};

const seedUsers = async () => {
    console.log("👤 Seeding users...");
    
    const usersData = [
        {
            full_name: "John Doe",
            email: "john@example.com",
            password: "password123",
            phone: "555-1234"
        },
        {
            full_name: "Jane Smith",
            email: "jane@example.com",
            password: "password123",
            phone: "555-5678"
        },
        {
            full_name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            phone: "555-0000"
        }
    ];

    try {
        for (const userData of usersData) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const id = await getNextNumericId(User);
                await User.create({ ...userData, id });
                console.log(`✅ Added user: ${userData.full_name}`);
            } else {
                console.log(`⏭️  User already exists: ${userData.email}`);
            }
        }
    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("✅ Connected to MongoDB\n");

        // Clear existing data (optional - comment out if you want to preserve data)
        // await Pet.deleteMany({});
        // await User.deleteMany({});
        // console.log("Cleared existing data\n");

        await seedPets();
        console.log();
        await seedUsers();

        console.log("\n✨ Database seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();

