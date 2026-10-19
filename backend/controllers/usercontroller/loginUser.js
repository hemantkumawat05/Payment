import trycatch from "../../middelware/trycatch.js";


import { loginSchema } from "../../config/zod.js"
import sanitize from "mongo-sanitize"
import { redisClient } from "../../server.js"
import userModel from "../../models/userModel.js"
import bcrypt from "bcrypt"

import sendMail from "../../config/sendMail.js"
import { getOtpHtml } from "../../config/html.js"
import { success } from "zod";




export const loginUser = trycatch(async (req, res) => {
    const sanitizedBody = sanitize(req.body)

    const validation = loginSchema.safeParse(sanitizedBody)

    if (!validation.success) {
        const zodError = validation.error
        let firstErrorMessage = "validation failed"
        let allErrors = []
        if (zodError?.issues && Array.isArray(zodError.issues)) {
            allErrors = zodError.issues.map((issue) =>
            ({
                field: issue.path ? issue.path.join(".") : "Unkonwn",
                message: issue.message || "Validation Error",
                code: issue.code
            }))
            firstErrorMessage = allErrors[0]?.message || "Validation Error"
        }
        return res.status(400).json({
            message: firstErrorMessage,
            error: allErrors
        })
    }

    const { email, password } = validation.data
    // console.log(req.ip,req.email)
    //--------------------req.email testing need when two user try to login same time its fail or not because req.email is undefined-------

    const rateLimitKey = `login-rate-limit:${req.ip}:${email}`

    if (await redisClient.get(rateLimitKey)) {
        return res.status(429).json({
            message: "Too many requests,try again later"
        })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const comparePassword = await bcrypt.compare(password, user.password)

    if (!comparePassword) {
        return res.status(400).json({
            message: "Invalid Credentials"
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const otpkey = `otp:${email}`
    await redisClient.set(otpkey, JSON.stringify(otp), { EX: 300 })// otp valid for 5 min only ---------


    const subject = "OTP for Verification"
    const html = getOtpHtml({ email, otp })

    await sendMail({ email, subject, html })

    await redisClient.set(rateLimitKey, "true", { EX: 60 }) //---rate limiting for 1 min 

    res.json({
        success: true,
        message: "if your email is valid, an otp has been sent. it will be valid for 5 min"
    })






})