import { useContext, useEffect, useState } from "react"
import Title from "../components/Title"
import {FaIndianRupeeSign} from "react-icons/fa6"
import { AppContext } from "../context/appContextObject"
import API from "../api"
import { getImageUrl } from "../utils/imageUrl"
const MyBookings=()=>{
    const [bookings,setBookings]=useState([])
    const {backendUrl,getCars}=useContext(AppContext)

    useEffect(()=>{
        let ignore=false
        const fetchMyBookings=async()=>{
            try{
                const res = await API.get("/bookings/my-bookings")
                if(!ignore && res.data.success){
                    setBookings(res.data.bookings)
                }
            }
            catch(error){
                console.log(error)
            }
        }
        fetchMyBookings()
    },[])

    const cancelBooking=async(id)=>{
        try{
            const res = await API.delete(`/bookings/${id}`)
            if(res.data.success){
                setBookings((prev)=>prev.map((booking)=>booking._id===id ? {...booking,status:"cancelled"} : booking))
                await getCars()
            }
        }
        catch(error){
            console.log(error)
        }
    }
    return(
        <div className="page-soft">
            <div className="container mt-5">
                <Title title="My Bookings" subTitle="View and manage your all car bookings" />
            </div>
            <div className="container mt-5">
                <div className="row">
                    {
                        bookings.map((booking,index)=>{
                            return(
                                <div className="col-lg-12" key={booking._id}>
                                    <div className="card booking-card mb-3">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                               <img src={getImageUrl(booking.car?.image, backendUrl)} className="img-fluid rounded-start bookings-image" alt="Booked car"/>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <p>Booking #{index+1}</p>
                                                    <table className="table table-dark">
                                                        <thead>
                                                            <tr>
                                                                <th colSpan={2}>Car Details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Brand</td>
                                                                <td>{booking.car?.brand}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Category</td>
                                                                <td>{booking.car?.category}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Seating Capacity</td>
                                                                <td>{booking.car?.seating_capacity}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="ms-3">
                                                {booking.status==='confirmed'?<span className="status-pill success">{booking.status}</span>:<span className="status-pill danger">{booking.status}</span>}
                                            </div>
                                            <div className="ms-3">
                                                <p>Rental Period:{booking.pickupDate} To {booking.returnDate}</p>
                                            </div>
                                            <div className="ms-3">
                                                <p>Pick-up Location:{booking.car?.location}</p>
                                            </div>
                                            <div className="ms-3">
                                                <p>Total Price:<FaIndianRupeeSign className="text-success"/>{booking.totalPrice}</p>
                                                <p>Payment: {booking.paymentMethod || "cash"} ({booking.paymentStatus || "pending"})</p>
                                                <p>Booked on : {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"}</p>
                                                {booking.status==="confirmed" && (<button className="btn btn-danger" onClick={()=>cancelBooking(booking._id)}>Cancel Booking</button>)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
export default MyBookings
