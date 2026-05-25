import {useContext, useEffect, useState } from "react"
import Title from "../../components/owner/Title"
import API from "../../api"
import { AppContext } from "../../context/appContextObject"
import { getImageUrl } from "../../utils/imageUrl"

const ManageBookings=()=>{
    const [bookings,setBookings]=useState([])
    const [error,setError]=useState("")
    const {backendUrl,showMessage,getCars}=useContext(AppContext)

    useEffect(()=>{
        let ignore=false
        const fetchOwnerBookings=async()=>{
            try{
                const res=await API.get("/bookings/owner-bookings")
                if(!ignore && res.data.success){
                    setError("")
                    setBookings(res.data.bookings)
                }
                else if(!ignore){
                    setError(res.data.message || "Bookings could not be loaded")
                }
            }
            catch(error){
                console.log(error)
                if(!ignore){
                    setError(error.response?.data?.message || error.message)
                }
            }
        }
        fetchOwnerBookings()
        return ()=>{ignore=true}
    },[])

    const updateStatus=async(id,status)=>{
        try{
            const res=await API.patch(`/bookings/${id}/status`,{status})
            showMessage(res.data.message,res.data.success ? "success" : "error")
            if(res.data.success){
                setBookings((prev)=>prev.map((booking)=>(
                    booking._id===id ? {...booking,status:res.data.booking.status} : booking
                )))
                await getCars()
            }
        }
        catch(error){
            showMessage(error.response?.data?.message || error.message,"error")
        }
    }

    return(
        <>
            <div className="owner-page-title">Manage Booking Details</div>
            <div className="container mt-5">
                <Title title='Manage Bookings' subTitle='Track all customer bookings, approve and cancel requests, and manage booking status'/>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-panel table-responsive">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Date Range</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                bookings.map((booking)=>(
                                    <tr key={booking._id}>
                                        <td>
                                            <img src={getImageUrl(booking.car?.image, backendUrl)} alt={booking.car?.brand} className="image-car-dashboard" />
                                            <div>
                                                <p>{booking.car?.brand}</p>
                                            </div>
                                        </td>
                                        <td>
                                            {booking.pickupDate} to {booking.returnDate}
                                        </td>
                                        <td>
                                            {booking.totalPrice}
                                        </td>
                                        <td>
                                            <span className={booking.paymentStatus==="paid" ? "bg-success-subtle text-success-emphasis px-2 py-1 rounded" : "bg-primary-subtle text-primary-emphasis px-2 py-1 rounded"}>
                                                {booking.paymentMethod || "cash"} - {booking.paymentStatus || "pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <select className="form-select" value={booking.status} onChange={(e)=>updateStatus(booking._id,e.target.value)}>
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="completed">Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>    
        </>
    )
}
export default ManageBookings
