import Title from "../../components/owner/Title"
import { useEffect,useState } from "react"
import {NavLink} from "react-router-dom"
import {MdCarRental} from "react-icons/md"
import { FaCalendarCheck, FaCarSide, FaIndianRupeeSign } from "react-icons/fa6"
import { IoAddCircleOutline } from "react-icons/io5"
import { BsClipboard2CheckFill } from "react-icons/bs"
import { useContext } from "react"
import API from "../../api"
import { AppContext } from "../../context/appContextObject"

const Dashboard=()=>{
    const {user}=useContext(AppContext)
    const [data,setData]=useState({
        totalCars:0,
        totalBookings:0,
        totalEarnings:0,
        availableCars:0,
        bookedCars:0
    })
    const [error,setError]=useState("")
    const dashboardCards=[
        {title:"Total Cars", value:data.totalCars, icon:<FaCarSide/>},
        {title:"Bookings", value:data.totalBookings, icon:<FaCalendarCheck/>},
        {title:"Earnings", value:`₹${data.totalEarnings}`, icon:<FaIndianRupeeSign/>},
        {title:"Available Cars", value:data.availableCars, icon:<FaCarSide/>},
        {title:"Booked Cars", value:data.bookedCars, icon:<BsClipboard2CheckFill/>},
    ]
    const quickActions=[
        {
            title:"Add New Car",
            text:"List a new vehicle with pricing, location, and image.",
            to:"/owner/addcar",
            icon:<IoAddCircleOutline/>
        },
        {
            title:"Manage Cars",
            text:"Update availability, review listed cars, or remove old records.",
            to:"/owner/managecar",
            icon:<FaCarSide/>
        },
        {
            title:"Manage Bookings",
            text:"Track customer bookings and update their current status.",
            to:"/owner/managebookings",
            icon:<BsClipboard2CheckFill/>
        },
    ]

    useEffect(()=>{
        let ignore=false
        const fetchDashboard=async()=>{
            try{
                const res = await API.get("/bookings/dashboard")
                if(!ignore && res.data.success){
                    setError("")
                    setData({
                        totalCars:res.data.totalCars,
                        totalBookings:res.data.totalBookings,
                        totalEarnings:res.data.totalEarnings,
                        availableCars:res.data.availableCars,
                        bookedCars:res.data.bookedCars,
                    })
                }
                else if(!ignore){
                    setError(res.data.message || "Dashboard data could not be loaded")
                }
            }
            catch(error){
                console.log(error)
                if(!ignore){
                    setError(error.response?.data?.message || error.message)
                }
            }
        }
        fetchDashboard()
        return ()=>{ignore=true}
    },[])
    return(
        <>
            <div className="owner-topbar">
                <div className="container d-flex align-items-center justify-content-between">
                    <NavLink className="owner-brand" to="/" ><MdCarRental/> car<span>Rent</span></NavLink>
                    <NavLink className="btn btn-outline-light btn-sm" to="/">View Website</NavLink>
                </div>
            </div>

            <main className="owner-dashboard">
                <div className="container">
                    <section className="dashboard-hero">
                        <div>
                            <p className="dashboard-eyebrow">Owner Panel</p>
                            <h1>Welcome, {user?.name || "Owner"}</h1>
                            <p>Monitor cars, bookings, availability, and revenue from one place.</p>
                        </div>
                        <div className="dashboard-hero-total">
                            <span>Revenue</span>
                            <strong>₹{data.totalEarnings}</strong>
                        </div>
                    </section>

                    <Title title='Dashboard Overview' subTitle='Live summary of your car rental business performance'></Title>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <section className="dashboard-grid">
                        {
                            dashboardCards.map((card,index)=>(
                                <div className="dashboard-stat" key={index}>
                                    <div className="dashboard-stat-icon">{card.icon}</div>
                                    <div>
                                        <p>{card.title}</p>
                                        <strong>{card.value}</strong>
                                    </div>
                                </div>
                            ))
                        }
                    </section>

                    <section className="dashboard-actions">
                        {
                            quickActions.map((action)=>(
                                <NavLink className="dashboard-action-card" to={action.to} key={action.title}>
                                    <div className="dashboard-action-icon">{action.icon}</div>
                                    <div>
                                        <h3>{action.title}</h3>
                                        <p>{action.text}</p>
                                    </div>
                                </NavLink>
                            ))
                        }
                    </section>

                    <section className="dashboard-summary row g-3">
                        <div className="col-lg-6">
                            <div className="dashboard-panel">
                                <h3>Booking Health</h3>
                                <p>Total bookings in system: <strong>{data.totalBookings}</strong></p>
                                <p>Currently booked cars: <strong>{data.bookedCars}</strong></p>
                                <p>Available cars: <strong>{data.availableCars}</strong></p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="dashboard-panel">
                                <h3>Next Steps</h3>
                                <p>Keep car images clear, prices updated, and booking statuses current.</p>
                                <NavLink className="btn btn-dark" to="/owner/managebookings">Review Bookings</NavLink>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
export default Dashboard
