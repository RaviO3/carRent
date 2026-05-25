import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import ownerMiddleware from "../middleware/ownerMiddleware.js"
import { createBooking,getMyBookings,cancelBooking,getOwnerBookings,ownerDashboard,updateBookingStatus } from "../controllers/bookingController.js"

const router=express.Router()
router.post("/create",authMiddleware,createBooking)
router.get("/my-bookings",authMiddleware,getMyBookings)
router.get("/owner-bookings",authMiddleware,ownerMiddleware,getOwnerBookings)
router.get("/dashboard",authMiddleware,ownerMiddleware,ownerDashboard)
router.patch("/:id/status",authMiddleware,ownerMiddleware,updateBookingStatus)
router.delete("/:id",authMiddleware,cancelBooking)


export default router
