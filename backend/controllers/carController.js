import Car from "../models/Car.js"
import Booking from "../models/Booking.js"
import User from "../models/User.js"
import { saveImageData } from "../utils/imageUpload.js"

const syncCarsAvailability = async (carIds) => {
    if(!carIds.length){
        return
    }

    const bookedCarIds=await Booking.distinct("car", {
        car: { $in: carIds },
        status: { $in: ["pending", "confirmed"] }
    })

    await Car.updateMany(
        { _id: { $in: carIds } },
        { isAvailable: true }
    )

    if(bookedCarIds.length){
        await Car.updateMany(
            { _id: { $in: bookedCarIds } },
            { isAvailable: false }
        )
    }
}

export const addCar=async(req,res)=>{
    try{ 
        const {brand,image,imageData,year,category,seating_capacity,fuel_type,transmission,pricePerDay,location,description}=req.body
        const uploadedImage=await saveImageData(imageData)
        const carImage=uploadedImage || image
        if(!brand || !carImage || !pricePerDay){
            return res.status(400).json({success:false,message:"Brand, image and daily price are required"})
        }
        const newCar = await Car.create({
            owner:req.userId,
            brand,
            image:carImage,
            year,
            category,
            seating_capacity,
            fuel_type,
            transmission,
            pricePerDay,
            location,
            description
        })
        await User.findByIdAndUpdate(req.userId,{role:"owner"})
        res.json({success:true,message:"Car Registered Successfully"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getCars=async(req,res)=>{
    try{
        const allCarIds=await Car.distinct("_id")
        await syncCarsAvailability(allCarIds)

        const {location,category,fuel_type,transmission,minPrice,maxPrice,sort}=req.query
        let filter={}
        if (location){
            filter.location={$regex:location,$options:"i"}
        }
        if (category){
            filter.category=category
        }
        if(fuel_type){
            filter.fuel_type=fuel_type
        }
        if(transmission){
            filter.transmission=transmission
        }
        if(minPrice || maxPrice){
            filter.pricePerDay={}
            if (minPrice){
                filter.pricePerDay.$gte=Number(minPrice)
            }
            if (maxPrice){
                filter.pricePerDay.$lte=Number(maxPrice)
            }
        }
        let query=Car.find(filter)
        if(sort==="lowToHigh"){
            query = query.sort({pricePerDay:1})
        }
        else if(sort==="highToLow"){
            query = query.sort({pricePerDay:-1})
        }
        const cars=await query
        res.json({success:true,cars})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getCarById=async(req,res)=>{
    try{
        const car=await Car.findById(req.params.id)
        if(!car){
            return res.json({success:false,message:"Car not Found"})
        }
        await syncCarsAvailability([car._id])
        const updatedCar=await Car.findById(req.params.id)
        res.json({success:true,car:updatedCar})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const deleteCar=async(req,res)=>{
    try{
        const car=await Car.findById(req.params.id)
        if(!car){
            return res.json({success:false,message:"Car not Found"})
        }
        if(car.owner.toString() !== req.userId){
            return res.status(403).json({success:false,message:"Unauthorized"})
        }
        await car.deleteOne()
        res.json({success:true,message:"Car Deleted"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getOwnerCars=async(req,res)=>{
    try{
        const ownerCarIds=await Car.distinct("_id", {
            owner:req.userId
        })
        await syncCarsAvailability(ownerCarIds)
        const cars=await Car.find({
            owner:req.userId
        })
        res.json({success:true,cars})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const updateCar=async(req,res)=>{
    try{
        const car=await Car.findById(req.params.id)
        if(!car){
            return res.json({success:false,message:"Car not Found"})
        }
        if(car.owner.toString() !==req.userId){
            return res.status(403).json({success:false,message:"Unauthorized"})
        }
        const uploadedImage=await saveImageData(req.body.imageData)
        const updates={...req.body}
        delete updates.imageData
        if(uploadedImage){
            updates.image=uploadedImage
        }
        const updateCar=await Car.findByIdAndUpdate(
            req.params.id,
            updates,
            {new:true}
        )
        res.json({success:true,message:"Updated Car",updateCar})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}
