import crypto from "node:crypto"
import Booking from "../models/Booking.js"
import Car from "../models/Car.js"

const activeBookingFilter = {
    status: { $in: ["pending", "confirmed"] }
};

const hasDateOverlap = (pickupDate, returnDate) => ({
    pickupDate: { $lt: returnDate },
    returnDate: { $gt: pickupDate }
});

const refreshCarAvailability = async (carId) => {
    const activeBooking = await Booking.findOne({
        car: carId,
        ...activeBookingFilter
    });

    return Car.findByIdAndUpdate(
        carId,
        { isAvailable: !activeBooking },
        { new: true }
    );
};

const syncCarsAvailability = async (carIds) => {
    if(!carIds.length){
        return [];
    }

    const bookedCarIds = await Booking.distinct("car", {
        car: { $in: carIds },
        ...activeBookingFilter
    });

    await Car.updateMany(
        { _id: { $in: carIds } },
        { isAvailable: true }
    );

    if(bookedCarIds.length){
        await Car.updateMany(
            { _id: { $in: bookedCarIds } },
            { isAvailable: false }
        );
    }

    return bookedCarIds.map((id)=>id.toString());
};

const verifyRazorpayPayment = ({paymentOrderId,paymentId,paymentSignature}) => {
    if (!paymentOrderId || !paymentId || !paymentSignature) {
        return false;
    }

    const isDemoPayment = paymentOrderId.startsWith("demo_order_") && paymentId.startsWith("demo_payment_");
    if (isDemoPayment && !process.env.RAZORPAY_KEY_SECRET) {
        return true;
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
        return false;
    }

    const body = `${paymentOrderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    return expectedSignature === paymentSignature;
};

export const createBooking=async (req,res)=>{
    try{
        const {carId,pickupDate,returnDate,paymentMethod,paymentOrderId,paymentId,paymentSignature}=req.body
        if(!carId || !pickupDate || !returnDate){
            return res.status(400).json({success:false,message:"Car, pickup date and return date are required"})
        }
        const pickup=new Date(pickupDate)
        const dropoff=new Date(returnDate)
        if(Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime()) || dropoff <= pickup){
            return res.status(400).json({success:false,message:"Please choose a valid date range"})
        }
        const car=await Car.findById(carId)
        if(!car){
            return res.status(404).json({success:false,message:"Car not found"}) 
        }
        if(!car.isAvailable){
            return res.status(409).json({success:false,message:"Car is not Available"})
        }
        const existingBooking=await Booking.findOne({
            car:carId,
            ...activeBookingFilter,
            ...hasDateOverlap(pickupDate,returnDate)
        })
        if(existingBooking){
            return res.status(409).json({success:false,message:"Car is already booked for these dates"})
        }
        const rentalDays=Math.ceil((dropoff-pickup)/(1000*60*60*24))
        const bookingTotal=rentalDays * Number(car.pricePerDay || 0)
        const selectedPaymentMethod=paymentMethod || "cash"
        const selectedPaymentStatus=selectedPaymentMethod==="online" ? "paid" : "pending"

        if(selectedPaymentMethod==="online" && !verifyRazorpayPayment({paymentOrderId,paymentId,paymentSignature})){
            return res.status(400).json({success:false,message:"Payment verification failed"})
        }

        const booking=await Booking.create({
            car:carId,
            user:req.userId,
            pickupDate,
            returnDate,
            totalPrice:bookingTotal,
            paymentMethod:selectedPaymentMethod,
            paymentStatus:selectedPaymentStatus,
            paymentOrderId,
            paymentId,
            paymentSignature
        })
        car.isAvailable=false
        await car.save()
        res.json({success:true,message:"Booking Successful",booking})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getMyBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({
            user:req.userId
        })
        .populate("car")
        res.json({success:true,bookings})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const cancelBooking=async (req,res)=>{
    try{
        const booking= await Booking.findById(req.params.id)
        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"})
        }
        if(booking.user.toString() !== req.userId){
            return res.status(403).json({success:false,message:"Unauthorized"})
        }
        booking.status="cancelled"
        await booking.save()
        await refreshCarAvailability(booking.car)
        res.json({success:true,message:"Booking Cancelled"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const getOwnerBookings=async(req,res)=>{
    try{
        const ownerCars=await Car.find({
            owner:req.userId
        })
        const CarIds=  ownerCars.map((car)=>car._id)
        await syncCarsAvailability(CarIds)
        const bookings=await Booking.find({
            car:{$in: CarIds}
        })
        .populate("car")
        .populate("user","name email")
        res.json({success:true,bookings})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const ownerDashboard=async(req,res)=>{
    try{
        const cars=await Car.find({
            owner:req.userId
        })
        const carIds= cars.map((car)=>car._id)
        const bookedCarIds=await syncCarsAvailability(carIds)
        const activeBookings=await Booking.find({
            car:{$in: carIds},
            ...activeBookingFilter
        })
        const paidBookings=await Booking.find({
            car:{$in: carIds},
            status:{$ne:"cancelled"}
        })
        const totalEarnings=paidBookings.reduce(
            (sum,booking)=>sum+booking.totalPrice,0
        )
        const bookedCars=bookedCarIds.length
        const availableCars=cars.length-bookedCars

        res.json({
            success:true,
            totalCars:cars.length,
            totalBookings:activeBookings.length,
            totalEarnings,
            availableCars,
            bookedCars
        })
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const updateBookingStatus=async(req,res)=>{
    try{
        const {status}=req.body
        const allowedStatuses=["pending","confirmed","cancelled","completed"]
        if(!allowedStatuses.includes(status)){
            return res.status(400).json({success:false,message:"Invalid booking status"})
        }

        const booking=await Booking.findById(req.params.id).populate("car")
        if(!booking){
            return res.status(404).json({success:false,message:"Booking not found"})
        }
        if(booking.car.owner.toString() !== req.userId){
            return res.status(403).json({success:false,message:"Unauthorized"})
        }

        if(status==="confirmed"){
            const overlappingBooking=await Booking.findOne({
                _id:{$ne:booking._id},
                car:booking.car._id,
                ...activeBookingFilter,
                ...hasDateOverlap(booking.pickupDate,booking.returnDate)
            })
            if(overlappingBooking){
                return res.status(409).json({success:false,message:"Another booking already uses these dates"})
            }
        }

        booking.status=status
        await booking.save()
        const updatedCar=await refreshCarAvailability(booking.car._id)
        res.json({
            success:true,
            message:"Booking status updated",
            booking,
            carAvailability:updatedCar?.isAvailable
        })
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}
