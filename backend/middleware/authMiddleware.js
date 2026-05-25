const authMiddleware=(req,res,next)=>{
    const userId=req.session.userId
    if(!userId){
        return res.status(401).json({success:false,message:"Not Logged In"})
    }
    req.userId=userId
    next()
}
export default authMiddleware
