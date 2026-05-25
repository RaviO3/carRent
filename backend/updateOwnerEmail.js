import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const updateOwnerEmail = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const password = await bcrypt.hash("owner123", 10);
    const oldOwner = await User.findOne({ email: "owner@carrent.com" });
    const newOwner = await User.findOne({ email: "owner@gmail.com" });

    if (oldOwner && !newOwner) {
        oldOwner.email = "owner@gmail.com";
        oldOwner.password = password;
        oldOwner.role = "owner";
        await oldOwner.save();
    } else if (newOwner) {
        newOwner.password = password;
        newOwner.role = "owner";
        await newOwner.save();
    } else {
        await User.create({
            name: "Demo Owner",
            email: "owner@gmail.com",
            password,
            role: "owner",
        });
    }

    console.log("Owner login updated: owner@gmail.com / owner123");
    await mongoose.disconnect();
};

updateOwnerEmail().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
});
