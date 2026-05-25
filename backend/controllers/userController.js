import User from "../models/User.js"
import bcrypt from "bcryptjs"
export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(409).json({success:false,message:"User already Exists"})
        }
        const hashPassword=await bcrypt.hash(password,10)
        const user=await User.create({
            name,
            email,
            password:hashPassword
        })
        res.status(201).json({success:true,message:"User Registered Successfully"})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({success:false,message:"Email and password are required"})
        }
        const user=await User.findOne({email})
        if(!user){
           return res.status(401).json({success:false, message:"New User!! First Register Yourself at SignUp"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({success:false,message:"Invalid Credentials"})
        }
        req.session.userId=user._id
        req.session.save((err)=>{
            if(err){
                return res.status(500).json({success:false,message:"Session Error"})
            }
            const safeUser={_id:user._id,name:user.name,email:user.email,role:user.role}
            return res.json({success:true,message:"Login Successful",user:safeUser})
        })
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}

export const logoutUser=(req,res)=>{
    req.session.destroy(()=>{
        res.clearCookie("connect.sid")
        res.json({success:true,message:"Logout Successful"})
    })
}

export const getMe=async(req,res)=>{
    try{
        if(!req.session.userId){
            return res.status(401).json({success:false,message:"Not Logged In"})
        }
        const user = await User.findById(
            req.session.userId
        ).select("-password")
        res.json({success:true,user})
    }
    catch(error){
        res.json({success:false,message:error.message})
    }
}
