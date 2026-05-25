import express from "express"
import { getCars,getCarById,deleteCar,getOwnerCars,updateCar } from "../controllers/carController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import ownerMiddleware from "../middleware/ownerMiddleware.js"

const router=express.Router()

router.get("/",getCars)
router.get("/owner-cars",authMiddleware,ownerMiddleware,getOwnerCars)
router.get("/:id",getCarById)
router.delete("/:id",authMiddleware,ownerMiddleware,deleteCar)
router.put("/update/:id",authMiddleware,ownerMiddleware,updateCar)


export default router
