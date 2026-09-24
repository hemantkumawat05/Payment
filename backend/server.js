import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import transactionRoute from "./routes/transactionRoute.js";
import userRouter from "./routes/userRouter.js";
//----------app config ----------
const app = express()
const PORT = process.env.PORT || 3000
//------------middlewares ------
app.use(cors());
app.use(express.json())
connectDB()

app.use("/api/user", userRouter)
app.use("/api/transaction", transactionRoute)

app.get("/", (req, res) => { res.json({ message: "Api working" }) })
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })