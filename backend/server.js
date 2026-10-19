import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser"

//----Import routes
import transactionRoute from "./routes/transactionRoute.js";
import userRouter from "./routes/userRouter.js";
//----------app config ----------
const app = express()
const PORT = process.env.PORT || 3000
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.FRONTENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "x-xsrf-token", "csrf-token"]
}));
app.use(express.json())
app.use(cookieParser())
connectDB()


const redisUrl=process.env.REDIS_URL
if(!redisUrl)
{
    console.log("Missing Redis URL")
    process.exit(1)
}
export const redisClient=createClient({
    url:redisUrl
})
redisClient.connect().then(()=>console.log("Connected to Redis")).catch(console.error)

//---------using routes
app.use("/api/user", userRouter)
app.use("/api/transaction", transactionRoute)

app.get("/", (req, res) => { res.json({ message: "Api working" }) })
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })