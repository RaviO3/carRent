import { FaGoogle } from "react-icons/fa6"
import { FaFacebook } from "react-icons/fa6"
import { MdPhone } from "react-icons/md"
import {NavLink} from "react-router-dom"
import { useContext,useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import { AppContext } from "../context/appContextObject"
const Login=()=>{
    const navigate=useNavigate()
    const {setUser,showMessage}= useContext(AppContext)
    const [formData,setFormData]=useState({
        email:"",
        password:""
    })
    const handleChange=(e)=>{
        setFormData({
            ...formData,
        [e.target.name]:e.target.value
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            const res=await API.post("/users/login", formData)
            if(res.data.success){
                setUser(res.data.user)
                navigate("/")
            }
            else{
                showMessage(res.data.message,"error")
            }
        }
        catch(error){
            showMessage(error.response?.data?.message || error.message,"error")
        }
    }
    return(
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-heading">
                    <span>Welcome back</span>
                    <h1>Login to carRent</h1>
                    <p>Access bookings, dashboard, and rental history.</p>
                </div>
                    <form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="my-3">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                        </div>
                        <div className="my-5">
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                            <p className="text-center mt-3 mb-0">New here? <NavLink to='/signup'>Create account</NavLink></p>
                        </div>
                        <hr />
                        <div className="auth-socials">
                            <button  type="button" className="btn border"><FaGoogle className="mx-2" />Google</button>
                            <button type="button" className="btn border"><FaFacebook className="mx-2" />Facebook</button>
                            <button type="button" className="btn border"><MdPhone className="mx-2" />Phone</button>
                        </div>
                    </form>
            </div>
        </div>
    )
}
export default Login
