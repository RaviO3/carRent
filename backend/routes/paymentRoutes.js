import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createPaymentOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/order", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
