import mongoose from "mongoose";

const carSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    year:Number,
    category:String,
    seating_capacity:Number,
    fuel_type:String,
    transmission:String,
    pricePerDay:Number,
    location:String,
    description:String,
    isAvailable:{
        type:Boolean,
        default:true
    }
})

const Car=mongoose.model("Car",carSchema)
export default Car