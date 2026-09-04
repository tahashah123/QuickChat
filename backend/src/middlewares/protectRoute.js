import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies?.jwt
    if(!token) return res.status(401).json({message:"unauthorized-cookie could not found"})
    const decoded =  jwt.verify(token,process.env.SECRET_KEY,)
    if(!decoded) return res.sendStatus(401)
   const user =  await User.findById(decoded.userId).select("-password")
    if(!user) return res.status(401).json({message:"user could not find"})
    req.user = user
    next()
    } catch (error) {
        console.error("protectRoute middlware error :"+ error)
        return res.status(401).json({message:"Unauthorized"})
    }
}