import {NavLink} from "react-router-dom"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api"
import { AppContext } from "../context/appContextObject"

const Signup=()=>{
    const navigate=useNavigate()
    const {showMessage}=useContext(AppContext)
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        agree:false
    })

    const handleChange=(e)=>{
        const {name,value,type,checked}=e.target
        setFormData((prev)=>({
            ...prev,
            [name]:type==="checkbox" ? checked : value
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(formData.password !== formData.confirmPassword){
            showMessage("Passwords do not match","error")
            return
        }
        if(!formData.agree){
            showMessage("Please agree to the terms and conditions","error")
            return
        }
        try{
            const res=await API.post("/users/register", {
                name:formData.name,
                email:formData.email,
                password:formData.password
            })
            showMessage(res.data.message,res.data.success ? "success" : "error")
            if(res.data.success){
                navigate("/login")
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
                    <span>Start renting</span>
                    <h1>Create Account</h1>
                    <p>Book cars, manage trips, and list vehicles as an owner.</p>
                </div>
                    <form onSubmit={handleSubmit}>
                        <div className="my-3">
                            <label>Full Name</label>
                            <input type="text" className="form-control" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="my-3">
                            <label>Email</label>
                            <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="my-3">
                            <label>Password</label>
                            <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
                        </div>
                        <div className="my-3">
                            <label>Confirm Password</label>
                            <input type="password" className="form-control" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
                        </div>
                        <div>
                            <input type="checkbox" className="form-check-input" name="agree" checked={formData.agree} onChange={handleChange} />
                            <span className="ms-2">I agree to terms and conditions</span>
                        </div>
                        <button className="btn btn-primary w-100 mt-4">Signup</button>
                        <p className="text-center mt-3 mb-0">Already registered? <NavLink to='/login'>Login</NavLink></p>
                    </form>
            </div>
        </div>
    )
}
export default Signup
