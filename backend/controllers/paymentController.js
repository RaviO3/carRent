import crypto from "node:crypto";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

const calculateRental = (pickupDate, returnDate, pricePerDay) => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(returnDate);

    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime()) || dropoff <= pickup) {
        throw new Error("Please choose a valid date range");
    }

    const days = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
    return days * Number(pricePerDay || 0);
};

export const createPaymentOrder = async (req, res) => {
    try {
        const { carId, pickupDate, returnDate } = req.body;

        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ success: false, message: "Car not found" });
        }
        if (!car.isAvailable) {
            return res.status(409).json({ success: false, message: "Car is currently booked" });
        }

        const existingBooking = await Booking.findOne({
            car: carId,
            status: { $in: ["pending", "confirmed"] },
            pickupDate: { $lt: returnDate },
            returnDate: { $gt: pickupDate },
        });

        if (existingBooking) {
            return res.status(409).json({ success: false, message: "Car is already booked for these dates" });
        }

        const amount = calculateRental(pickupDate, returnDate, car.pricePerDay);
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            return res.json({
                success: true,
                demo: true,
                key: "rzp_test_demo",
                order: {
                    id: `demo_order_${Date.now()}`,
                    amount: amount * 100,
                    currency: "INR",
                },
                amount,
                message: "Razorpay keys are not configured. Demo payment order created",
            });
        }

        const receipt = `car_${Date.now().toString().slice(-12)}`;
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        let response;
        try {
            response = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: amount * 100,
                    currency: "INR",
                    receipt,
                }),
            });
        } catch (error) {
            return res.status(502).json({
                success: false,
                message: "Cannot connect to Razorpay. Check internet connection, firewall, or restart the backend server.",
            });
        }

        const order = await response.json();
        if (!response.ok) {
            return res.status(400).json({ success: false, message: order.error?.description || "Payment order failed" });
        }

        res.json({ success: true, demo: false, key: keyId, order, amount });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, demo } = req.body;

        if (demo) {
            return res.json({ success: true, message: "Demo payment verified" });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(400).json({ success: false, message: "Payment secret is not configured" });
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", keySecret)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        res.json({ success: true, message: "Payment verified" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
