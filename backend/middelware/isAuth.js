import jwt from "jsonwebtoken"
import { redisClient } from "../server.js"
import userModel from "../models/userModel.js"
import { isSessionActive } from "../config/generateToken.js"
import { clearAuthCookies } from "../config/cookieOptions.js"

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(403).json({
                message: "Please login no-token"
            })
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedData) {
            return res.status(400).json({
                message: "Token Expired"
            })
        }

        const sessionActive = await isSessionActive(decodedData.id, decodedData.sessionId)

        if (!sessionActive) {
            clearAuthCookies(res)

            return res.status(401).json({
                message: "Session Expired. You have been logged in From another device "
            })
        }

        const cacheUser = await redisClient.get(`user:${decodedData.id}`)

        if (cacheUser) {
            req.user = JSON.parse(cacheUser)
            req.userId = decodedData.id
            req.sessionId = decodedData.sessionId
            return next()
        }
        //----------------decodedData.id
        const user = await userModel.findById(decodedData.id).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "no user with this id"
            })
        }

        await redisClient.setEx(`user:${user._id}`, 3600, JSON.stringify(user))

        req.user = user
        req.userId = decodedData.id
        req.sessionId = decodedData.sessionId
        next()

    }
    catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(403).json({
                message: "Token Expired or Invalid"
            });
        }
        res.status(500).json({ message: error.message })
    }
}

export default isAuth