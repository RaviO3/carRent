import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Car from "./models/Car.js";
import User from "./models/User.js";

const demoCars = [
    ["Toyota Innova", "car1.jpg", 2023, "SUV", 7, "Diesel", "Manual", 5000],
    ["Maruti Swift", "car2.jpg", 2023, "Hatchback", 5, "Petrol", "Manual", 3000],
    ["Toyota Urban Cruiser Hyryder", "car3.jpg", 2023, "SUV", 5, "Petrol", "Automatic", 3000],
    ["Tata Curvv", "car4.jpg", 2024, "SUV", 5, "Electric", "Automatic", 2500],
    ["Hyundai Creta", "car5.jpg", 2023, "SUV", 5, "Diesel", "Manual", 3500],
    ["Maruti WagonR", "car6.jpg", 2022, "Hatchback", 5, "Petrol", "Manual", 1800],
    ["Toyota Fortuner", "car7.jpg", 2023, "SUV", 7, "Diesel", "Automatic", 5000],
    ["Mahindra Thar", "car8.jpg", 2023, "SUV", 4, "Petrol", "Manual", 5000],
    ["Mahindra Scorpio-N", "car9.jpg", 2023, "SUV", 7, "Diesel", "Automatic", 5000],
    ["Hyundai Creta Automatic", "car10.jpg", 2023, "SUV", 5, "Diesel", "Automatic", 3000],
    ["Mahindra XUV700", "car11.jpg", 2023, "SUV", 7, "Diesel", "Manual", 4500],
    ["Toyota Innova Crysta", "car12.jpg", 2023, "MPV", 7, "Diesel", "Manual", 4200],
    ["BMW X5", "car13.jpg", 2023, "SUV", 5, "Diesel", "Automatic", 8000],
    ["BMW M4", "car14.jpg", 2023, "Coupe", 4, "Petrol", "Automatic", 9000],
    ["BMW 7 Series", "car15.jpg", 2023, "Sedan", 5, "Diesel", "Automatic", 10000],
    ["BMW X7", "car16.jpg", 2023, "SUV", 7, "Diesel", "Automatic", 11000],
    ["BMW iX", "car17.jpg", 2023, "SUV", 5, "Electric", "Automatic", 9500],
    ["Mercedes-Benz E-Class", "car18.jpg", 2023, "Sedan", 5, "Diesel", "Automatic", 9000],
    ["Mercedes-Benz GLC", "car19.jpg", 2023, "SUV", 5, "Diesel", "Automatic", 8500],
    ["Mercedes-Benz GLC Coupe", "car20.jpg", 2023, "SUV", 5, "Petrol", "Automatic", 8800],
    ["Mercedes-Benz E-Class Petrol", "car21.jpg", 2023, "Sedan", 5, "Petrol", "Automatic", 9200],
    ["Audi RS5", "car22.jpg", 2023, "Coupe", 4, "Petrol", "Automatic", 9500],
    ["Audi Q3", "car23.jpg", 2023, "SUV", 5, "Petrol", "Automatic", 6500],
    ["Audi Q5", "car24.jpg", 2023, "SUV", 5, "Diesel", "Automatic", 7500],
];

const seedCars = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    let owner = await User.findOne({ email: "owner@gmail.com" });
    if (!owner) {
        owner = await User.create({
            name: "Demo Owner",
            email: "owner@gmail.com",
            password: await bcrypt.hash("owner123", 10),
            role: "owner",
        });
    }

    for (const [brand, fileName, year, category, seats, fuel, transmission, price] of demoCars) {
        await Car.updateOne(
            { brand, owner: owner._id },
            {
                $setOnInsert: {
                    owner: owner._id,
                    brand,
                    image: `/car-images/${fileName}`,
                    year,
                    category,
                    seating_capacity: seats,
                    fuel_type: fuel,
                    transmission,
                    pricePerDay: price,
                    location: "Chandigarh",
                    description: `${brand} available for comfortable city and outstation rentals.`,
                    isAvailable: true,
                },
            },
            { upsert: true }
        );
    }

    console.log("Demo cars seeded successfully");
    console.log("Owner login: owner@gmail.com / owner123");
    await mongoose.disconnect();
};

seedCars().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
});
