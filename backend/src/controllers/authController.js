import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/Utils.js";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const foundUser = await User.findOne({ email });
        if (foundUser) {
            return res.status(400).json({ message: "This email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newuser) {
            generateToken(newuser._id, res);
            await newuser.save();

            return res.status(201).json({
                _id: newuser._id,
                fullName: newuser.fullName,
                email: newuser.email,
                profilePic: newuser.profilePic
            });
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const {password} = req.body
    const email = req.body.email?.trim().toLowerCase();
    try {
        if(!email || !password) return res.status(400).json({message:"email and password are required"})
    const foundUser = await  User.findOne({email})
    if(!foundUser)return res.status(401).json({message:"Invalid credentails"})
    const match = await bcrypt.compare(password,foundUser.password)
    if(!match) return res.status(401).json({message:"Invalid credentails"})
    generateToken(foundUser._id,res)
     return res.status(201).json({
                _id: foundUser._id,
                fullName: foundUser.fullName,
                email: foundUser.email,
                profilePic: foundUser.profilePic
            });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }

};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            maxAge: 0, 
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        });

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req,res)=>{
    try {
     const profilePic = req.body
    if(!profilePic) return res.status(400).json({message:"profile pic is required"})
    const userID = req.user._id
    const uploadedURL = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
        userID,
        {profilePic:uploadedURL.secure_url},
        {new:true}
    )
     return res.status(201).json(updatedUser)
    } catch (error) {
        console.log("error in update profile controller : " + error)
        return res.status(500).json({message:"Internal server error"})
    }

}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
         console.log("error in check Auth controller" + error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}