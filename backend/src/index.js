import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/authRoutes.js"
import cookieparser from "cookie-parser"
import messageRoute from "./routes/messageRoutes.js"
import cors from "cors"
const app = express();
dotenv.config()
const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("server running on PORT: "+PORT)
    connectDB()
})
app.use(cors({
    origin:/^http:\/\/localhost:\d+$/,
    credentials:true
}))
app.use(cookieparser())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoute)