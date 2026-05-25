import { NavLink, useNavigate } from "react-router-dom"
import { IoCarSport } from "react-icons/io5";
import {CiSearch} from "react-icons/ci"
import { useContext } from "react";
import API from "../api";
import { AppContext } from "../context/appContextObject";

const Navbar = () => {
    const navigate=useNavigate()
    const {user,setUser}=useContext(AppContext)
    const isOwner=user?.role==="owner"
    const handleLogout=async()=>{
        await API.get("/users/logout")
        setUser(null)
        navigate("/")
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/"><IoCarSport/>car<span className="text-danger">Rent</span></NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto">
                            
                            {
                                !user?<><NavLink className="nav-link" to="/">Home</NavLink>
                            <NavLink className="nav-link" to="/cars">Cars</NavLink>
                            <div className="d-flex my-1 mx-1">
                                <input type="text" placeholder="Search" className="form-control" />
                                <span><CiSearch className="text-white fs-4 ms-2"/></span>
                            </div>
                            <div className="d-flex my-1 mx-1">
                                <button className="btn btn-primary" onClick={()=>navigate("/login")}>LogIn</button>
                            </div>

                            </>:<>
                            <NavLink className="nav-link" to="/">Home</NavLink>
                            <NavLink className="nav-link" to="/cars">Cars</NavLink>
                            {isOwner ? (
                                <>
                                    <NavLink className="nav-link" to="/owner/dashboard">Dashboard</NavLink>
                                    <NavLink className="nav-link" to="/owner/managecar">Manage Cars</NavLink>
                                    <NavLink className="nav-link" to="/owner/managebookings">Bookings</NavLink>
                                </>
                            ) : (
                                <NavLink className="nav-link" to="/my-bookings">MyBookings</NavLink>
                            )}
                            <div className="d-flex my-1 mx-1">
                                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                            </div></>
                            }
                            
                            
                            


                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Navbar
