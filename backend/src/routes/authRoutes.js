import express from "express"
import { signup,login,logout, updateProfile, checkAuth } from "../controllers/authController.js"
import { protectRoute } from "../middlewares/protectRoute.js"


const router = express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.put("/updateprofile",protectRoute,updateProfile)
router.get("/checkAuth",protectRoute,checkAuth)

export default router;