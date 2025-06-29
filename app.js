import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import postRoute from "./routes/post.route.js"
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import propertyRoute from "./routes/property.route.js"

dotenv.config();

const app = express()
app.use(express.json())  
app.use(cookieParser());
app.use(cors({
    origin: 'https://urban-edge.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})