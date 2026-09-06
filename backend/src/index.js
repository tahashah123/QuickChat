import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoute from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. CORS Configuration
app.use(
  cors({
    origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
    credentials: true,
  })
);

// 2. Cookie Parser
app.use(cookieparser());

// 3. Body Parsers (Single express.json call with 10mb limit)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoute);

// 5. Start Server
app.listen(PORT, () => {
  console.log("Server running on PORT: " + PORT);
  connectDB();
});