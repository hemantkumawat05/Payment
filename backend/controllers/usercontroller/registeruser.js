import { registerSchema } from "../../config/zod.js"
import trycatch from "../../middelware/trycatch.js"
import sanitize from "mongo-sanitize"
import { redisClient } from "../../server.js"
import userModel from "../../models/userModel.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { json } from "zod"
import sendMail from "../../config/sendMail.js"
import { getVerifyEmailHtml } from "../../config/html.js"



const registeruser = trycatch(async (req, res) => {
    //use sanitizer for protect node.js and mongo applications from NoSQL injection attack
    const sanitizedBody = sanitize(req.body)

    const validation = registerSchema.safeParse(sanitizedBody)

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

    const { name, email, password } = validation.data

    const rateLimitKey = `register-rate-limit${req.ip}:${email}`
    if (await redisClient.get(rateLimitKey)) {
        return res.status(429).json({
            message: "Too many requests ,try again later"
        })
    }

    const existingUser = await userModel.findOne({ email })

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    //http://localhost:5173/token
    const verifyToken = crypto.randomBytes(32).toString("hex")

    const verifyKey = `verify:${verifyToken}`

    const datastore = JSON.stringify({
        name,
        email,
        password: hashPassword
    })

    await redisClient.set(verifyKey, datastore, { EX: 300 })     //expire in 5 min

    const subject = "Verify Your Email for Account Creation"
    const html = getVerifyEmailHtml({ email, token: verifyToken })
    await sendMail({ email, subject, html })

    await redisClient.set(rateLimitKey, "true", { EX: 60 })      //expire in 1 min 

    res.status(200).json({
        message: "If your email is valid, a verification link has been sent. It will expire in 5 Minutes"
    })
})

export default registeruser