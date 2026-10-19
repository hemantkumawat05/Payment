import trycatch from "../../middelware/trycatch.js";
import userModel from "../../models/userModel.js";
import { redisClient } from "../../server.js";
import verifyRefreshToken, { generateAccessToken } from "./verifyRefreshToken.js";
import { clearAuthCookies } from "../../config/cookieOptions.js";

export const verifyUser = trycatch(async (req, res) => {
    console.log("running.....")
    const { token } = req.params
    if (!token) {
        return res.status(500).json({
            message: "Verification Token is required"
        })
    }

    const verifyKey = `verify:${token}`
    const userDataJson = await redisClient.get(verifyKey)

    if (!userDataJson) {
        return res.status(400).json({
            message: "Verfication link is expired"
        })
    }

    await redisClient.del(verifyKey)

    const userData = JSON.parse(userDataJson)

    const existingUser = await userModel.findOne({ email: userData.email })

    if (existingUser) {
        return res.status(400).json({
            message: "User Already Exists"
        })
    }

    const newUser = await userModel.create({
        name: userData.name,
        email: userData.email,
        password: userData.password
    })

    res.status(201).json({
        message: "Email Verified successfully! your account has been created",
        user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    })
})







export const refreshToken = trycatch(async (req, res) => {
    const refreshToken = req.cookies.refreshToken


    if (!refreshToken) {
        return res.status(401).json({
            message: "Invalid refresh token1111"
        })
    }

    const decode = await verifyRefreshToken(refreshToken)

    if (!decode) {
        clearAuthCookies(res)

        return res.status(401).json({
            message: "Session Expired. Please Login "
        })
    }

    generateAccessToken(decode.id, decode.sessionId, res)
    res.status(200).json({
        message: "Token refreshed"
    })

})