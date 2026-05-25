import express from "express"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import cors from "cors"
import session from "express-session"
import path from "node:path"
import { fileURLToPath } from "node:url"
import userRoutes from "./routes/userRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js"
import carRoutes from "./routes/carRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"

const app=express()
const PORT=process.env.PORT || 5000
const isProduction=process.env.NODE_ENV==="production"
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const allowedOrigins=[
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URL_WWW,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean)

app.set("trust proxy",1)

connectDB()
app.use(cors({
    origin:(origin,callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            return callback(null,true)
        }
        callback(new Error("Not allowed by CORS"))
    },
    credentials:true
}))
app.use(express.json({limit:"7mb"}))
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use(session({
    secret:process.env.JWT_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:isProduction,
        sameSite:isProduction ? "none" : "lax",
        maxAge:1*24*60*60*1000,
    }
}))
app.use("/api/users",userRoutes)
app.use("/api/cars",carRoutes)
app.use("/api/bookings",bookingRoutes)
app.use("/api/payments",paymentRoutes)

app.get("/",(req,res)=>{
    res.send("CarRent API is running")
})

app.get("/profile",authMiddleware,(req,res)=>{
    res.send("Good Day!")
})



app.listen(PORT,()=>{console.log(`server is running at http://localhost:${PORT}`)})
