import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    car:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Car",
        required:true
    },
    user:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true 
    },
    pickupDate:{
        type:String,
        required:true
    },
    returnDate:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["cash","online"],
        default:"cash"
    },
    paymentStatus:{
        type:String,
        enum:["pending","paid","failed"],
        default:"pending"
    },
    paymentOrderId:String,
    paymentId:String,
    paymentSignature:String,
    status:{
        type:String,
        enum:["pending","confirmed","cancelled","completed"],
        default:"confirmed"
    }
},{timestamps:true})

const Booking = mongoose.model("Booking",bookingSchema)
export default Booking
