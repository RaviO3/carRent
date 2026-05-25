import { useEffect, useState, useContext } from "react"
import {useNavigate, useParams} from "react-router-dom"
import {FaIndianRupeeSign} from "react-icons/fa6"
import API from "../api"
import {AppContext} from "../context/appContextObject"
import { getImageUrl } from "../utils/imageUrl"

const loadRazorpayCheckout = () => {
    return new Promise((resolve) => {
        if(window.Razorpay){
            resolve(true)
            return
        }

        const existingScript=document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")
        if(existingScript){
            existingScript.addEventListener("load",()=>resolve(true),{once:true})
            existingScript.addEventListener("error",()=>resolve(false),{once:true})
            return
        }

        const script=document.createElement("script")
        script.src="https://checkout.razorpay.com/v1/checkout.js"
        script.onload=()=>resolve(true)
        script.onerror=()=>resolve(false)
        document.body.appendChild(script)
    })
}

const CarDetails=()=>{
    const{id}=useParams()
    const[car,setCar]=useState(null)
    const [bookingDates,setBookingDates]=useState({
        pickupDate:"",
        returnDate:""
    })
    const [paymentMethod,setPaymentMethod]=useState("cash")
    const [isBooking,setIsBooking]=useState(false)
    const navigate=useNavigate()
    const {backendUrl,getCars,user,showMessage}= useContext(AppContext)
    
    useEffect(()=>{
        let ignore=false
        const getCar = async()=>{
            try{
                const res=await API.get(`/cars/${id}`)
                if(!ignore && res.data.success){
                    setCar(res.data.car)
                }
            }
            catch(error){
                console.log(error)
            }
        }
        getCar()
        return ()=>{ignore=true}
    },[id])

    const calculateTotal = () => {
        const start=new Date(bookingDates.pickupDate)
        const end=new Date(bookingDates.returnDate)
        if(!bookingDates.pickupDate || !bookingDates.returnDate || end <= start){
            return null
        }
        const days=Math.ceil((end-start)/(1000*60*60*24))
        return days * Number(car.pricePerDay || 0)
    }

    const validateBooking = () => {
        if(!bookingDates.pickupDate || !bookingDates.returnDate){
            showMessage("Please select pickup and return dates","error")
            return null
        }
        const start=new Date(bookingDates.pickupDate)
        const end=new Date(bookingDates.returnDate)
        if(end <= start){
            showMessage("Return date must be after pickup date","error")
            return null
        }
        const days=Math.ceil((end-start)/(1000*60*60*24))
        return days * Number(car.pricePerDay || 0)
    }

    const createBooking = async (paymentData = {}) => {
        const totalPrice=validateBooking()
        if(!totalPrice) return

        const res=await API.post("/bookings/create", {
            carId:id,
            pickupDate:bookingDates.pickupDate,
            returnDate:bookingDates.returnDate,
            paymentMethod,
            paymentOrderId:paymentData.orderId,
            paymentId:paymentData.paymentId,
            paymentSignature:paymentData.paymentSignature
        })

        showMessage(res.data.message,res.data.success ? "success" : "error")
        if(res.data.success){
            await getCars()
            navigate("/my-bookings")
        }
    }

    const bookCar = async(e)=>{
        e.preventDefault()
        if(!user){
            navigate("/login")
            return
        }
        if(!car.isAvailable){
            showMessage("This car is currently booked","error")
            return
        }

        const totalPrice=validateBooking()
        if(!totalPrice) return

        try{
            setIsBooking(true)

            if(paymentMethod==="cash"){
                await createBooking()
                return
            }

            const orderRes=await API.post("/payments/order", {
                carId:id,
                pickupDate:bookingDates.pickupDate,
                returnDate:bookingDates.returnDate
            })

            if(!orderRes.data.success){
                showMessage(orderRes.data.message,"error")
                return
            }

            if(orderRes.data.demo){
                showMessage("Razorpay keys are not added in backend .env, so demo payment is used.","info")
                await API.post("/payments/verify", {demo:true})
                await createBooking({
                    orderId:orderRes.data.order.id,
                    paymentId:`demo_payment_${Date.now()}`,
                    paymentSignature:"demo_signature"
                })
                return
            }

            const isCheckoutLoaded=await loadRazorpayCheckout()
            if(!isCheckoutLoaded){
                showMessage("Razorpay checkout could not load. Check your internet connection and try again.","error")
                return
            }

            const checkoutOptions={
                key:orderRes.data.key,
                amount:orderRes.data.order.amount,
                currency:orderRes.data.order.currency,
                name:"carRent",
                description:`Booking for ${car.brand}`,
                order_id:orderRes.data.order.id,
                prefill:{
                    name:user?.name || "",
                    email:user?.email || ""
                },
                handler:async(response)=>{
                    const verifyRes=await API.post("/payments/verify", response)
                    if(verifyRes.data.success){
                        await createBooking({
                            orderId:response.razorpay_order_id,
                            paymentId:response.razorpay_payment_id,
                            paymentSignature:response.razorpay_signature
                        })
                    }
                    else{
                        showMessage(verifyRes.data.message,"error")
                    }
                }
            }

            const razorpay=new window.Razorpay(checkoutOptions)
            razorpay.open()
        }
        catch(error){
            showMessage(error.response?.data?.message || error.message,"error")
        }
        finally{
            setIsBooking(false)
        }
    }
    if(!car){
        return <h1>Loading...</h1>
    }
    const previewTotal = calculateTotal()
    return(
        <div className="container">
            <div className="my-3">
                <button onClick={()=>navigate(-1)} className="btn btn-dark">Back to All Cars</button>
            </div>
            <div className="my-3">
                <div className="row">
                    <div className="col-lg-6">
                        <img src={getImageUrl(car.image, backendUrl)} alt={car.brand} className="img-fluid car-detail-image" />
                        <table className="table table-dark">
                            <thead>
                                <tr>
                                    <th colSpan={2}>Car Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Brand</td>
                                    <td>{car.brand}</td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td>{car.category}</td>
                                </tr>
                                <tr>
                                    <td>Seating Capacity</td>
                                    <td>{car.seating_capacity}</td>
                                </tr>
                                <tr>
                                    <td>Fuel Type</td>
                                    <td>{car.fuel_type}</td>
                                </tr>
                                <tr>
                                    <td>Transmission</td>
                                    <td>{car.transmission}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>{car.location}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{car.description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-6">
                        <form onSubmit={bookCar}>
                            <div className="my-3">
                                <p><FaIndianRupeeSign className="text-success"/>{car.pricePerDay} /per day</p>
                            </div>
                            <hr />
                            <div className="my-3">
                                <label htmlFor="pickup-date">Pickup Date</label>
                                <input type="date" className="form-control" required id="pickup-date" value={bookingDates.pickupDate} onChange={(e)=>setBookingDates({...bookingDates,pickupDate:e.target.value})} />
                            </div>
                            <div className="my-3">
                                <label htmlFor="return-date">Return Date</label>
                                <input type="date" className="form-control" required id="return-date" value={bookingDates.returnDate} onChange={(e)=>setBookingDates({...bookingDates,returnDate:e.target.value})} />
                            </div>
                            <div className="my-3">
                                <label htmlFor="payment-method">Payment Method</label>
                                <select id="payment-method" className="form-select" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                                    <option value="cash">Pay Later</option>
                                    <option value="online">Online Payment</option>
                                </select>
                            </div>
                            <div className="payment-summary">
                                <p>Checkout Summary</p>
                                <strong><FaIndianRupeeSign className="text-success"/>{previewTotal || car.pricePerDay}</strong>
                                <span>{previewTotal ? "Total rental amount" : "Select dates to calculate total"}</span>
                            </div>
                            <div className="my-3">
                                <button className="btn btn-dark" type="submit" disabled={isBooking || !car.isAvailable}>
                                    {!car.isAvailable ? "Currently Unavailable" : isBooking ? "Processing..." : paymentMethod==="online" ? "Pay & Book" : "Book Now"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CarDetails
