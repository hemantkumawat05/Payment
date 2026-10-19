import { success } from "zod";
import { generateToken } from "../../config/generateToken.js";
import trycatch from "../../middelware/trycatch.js";
import userModel from "../../models/userModel.js";
import { redisClient } from "../../server.js";


const verifyOtp = trycatch(async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        return res.status(400).json({
            message: "Please provide all details"
        })
    }

    const otpKey = `otp:${email}`

    const storedOtpString = await redisClient.get(otpKey)

    if (!storedOtpString) {
        return res.status(400).json({
            message: "Otp expired"
        })
    }

    const storedotp = JSON.parse(storedOtpString)

    if (storedotp != otp) {
        return res.status(400).json({
            success: false,
            message: "Invalid Otp"
        })
    }

    await redisClient.del(otpKey)

    let user = await userModel.findOne({ email }).select("-password")

    const tokenData = await generateToken(user._id, res)

    res.status(200).json({
        message: `welcome ${user.name}`,
        user,
        sessionInfo: {
            sessionId: tokenData.sessionId,
            loginTime: new Date().toISOString(),
            csrfToken: tokenData.csrfToken
        }
    })



})


export default verifyOtp