import "dotenv/config";
import mongoose from "mongoose";
import Car from "./models/Car.js";

const hasGoodImage = (image = "") => (
    image.startsWith("/car-images/") ||
    image.startsWith("/uploads/") ||
    image.startsWith("http")
);

const cleanupDemoCars = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const cars = await Car.find({}).sort({ createdAt: 1 });
    let removedCount = 0;

    for (const car of cars) {
        if (!hasGoodImage(car.image)) {
            await Car.deleteOne({ _id: car._id });
            removedCount += 1;
        }
    }

    const remainingCars = await Car.find({}).sort({ brand: 1, createdAt: 1 });
    const seen = new Set();

    for (const car of remainingCars) {
        const key = `${car.brand.toLowerCase()}-${car.location?.toLowerCase() || ""}`;

        if (seen.has(key)) {
            await Car.deleteOne({ _id: car._id });
            removedCount += 1;
        } else {
            seen.add(key);
        }
    }

    console.log(`Cleanup complete. Removed ${removedCount} duplicate or bad-image cars.`);
    await mongoose.disconnect();
};

cleanupDemoCars().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
});
