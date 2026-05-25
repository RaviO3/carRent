import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Booking from "./models/Booking.js";
import Car from "./models/Car.js";
import User from "./models/User.js";

const ensureUser = async ({ name, email, password, role = "user" }) => {
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            password: await bcrypt.hash(password, 10),
            role,
        });
    }

    return user;
};

const seedBookings = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const owner = await ensureUser({
        name: "Demo Owner",
        email: "owner@gmail.com",
        password: "owner123",
        role: "owner",
    });

    const customer = await ensureUser({
        name: "Demo Customer",
        email: "customer@carrent.com",
        password: "customer123",
    });

    const ownerCars = await Car.find({ owner: owner._id }).limit(5);

    if (ownerCars.length === 0) {
        console.log("No owner cars found. Run npm run seed first, then run npm run seed:bookings.");
        await mongoose.disconnect();
        return;
    }

    const bookingDates = [
        { pickupDate: "2026-06-02", returnDate: "2026-06-05", status: "confirmed" },
        { pickupDate: "2026-06-10", returnDate: "2026-06-12", status: "pending" },
        { pickupDate: "2026-06-18", returnDate: "2026-06-21", status: "completed" },
        { pickupDate: "2026-06-25", returnDate: "2026-06-27", status: "cancelled" },
        { pickupDate: "2026-07-02", returnDate: "2026-07-06", status: "confirmed" },
    ];

    for (let i = 0; i < ownerCars.length; i += 1) {
        const car = ownerCars[i];
        const demo = bookingDates[i];
        const days = Math.ceil((new Date(demo.returnDate) - new Date(demo.pickupDate)) / (1000 * 60 * 60 * 24));

        await Booking.updateOne(
            {
                car: car._id,
                user: customer._id,
                pickupDate: demo.pickupDate,
                returnDate: demo.returnDate,
            },
            {
                $setOnInsert: {
                    car: car._id,
                    user: customer._id,
                    pickupDate: demo.pickupDate,
                    returnDate: demo.returnDate,
                    totalPrice: days * Number(car.pricePerDay || 0),
                    status: demo.status,
                },
            },
            { upsert: true }
        );
    }

    console.log("Demo bookings seeded successfully");
    console.log("Owner login: owner@gmail.com / owner123");
    console.log("Customer login: customer@carrent.com / customer123");
    await mongoose.disconnect();
};

seedBookings().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
});
