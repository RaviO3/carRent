import express from "express"
import { registerUser,loginUser,logoutUser,getMe } from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/logout",logoutUser)
router.get("/me",authMiddleware,getMe)

export default router