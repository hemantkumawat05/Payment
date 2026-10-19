import crypto from "crypto"
import { redisClient } from "../server.js"
import { getCookieOptions } from "./cookieOptions.js"

export const generateCSRFToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex")

    const csrfKey = `csrf:${userId}`

    await redisClient.setEx(csrfKey, 3600, csrfToken)

    res.cookie("csrfToken", csrfToken, getCookieOptions({
        httpOnly: false,
        maxAge: 60 * 60 * 1000
    }))
    return csrfToken
}



export const verifyCSRFToken = async (req, res, next) => {
    try {
        if (req.method === "GET") {
            return next()
        }

        const userId = (req.user?._id || req.userId)?.toString()

        if (!userId) {
            return res.status(401).json({
                message: "User Not Authenticated"
            })
        }


        const clientToken = req.headers["x-csrf-token"] || req.headers["x-xsrf-token"] || req.headers["csrf-token"]

        if (!clientToken) {
            return res.status(403).json({
                message: "CSRF Token Missing.Please Refresh the Page.",
                code: "CSRF_TOKEN_MISSING"
            })
        }

        const csrfKey = `csrf:${userId}`

        const storedToken = await redisClient.get(csrfKey)

        if (!storedToken) {
            return res.status(403).json({
                message: "CSRF Token Expired.Please Try Again.",
                code: "CSRF_TOKEN_EXPIRED"
            })
        }




        if (storedToken !== clientToken) {
            return res.status(403).json({
                message: "Invalid CSRF Token.Please Refresh Again.",
                code: "CSRF_TOKEN_INVALID"
            })
        }

        next()



    }
    catch (error) {
        console.log("CSRF Verification error:", error)

        return res.status(500).json({
            message: "CSRF verification failed.",
            code: "CSRF_VERIFICATION_ERROR"
        })
    }
}

export const revokCSRFToken=async(userId)=>
{
    const csrfKey=`csrf:${userId}`

    await redisClient.del(csrfKey)
}

export const refreshCSRFToken=async(userId,res)=>
{
    await revokCSRFToken(userId)

    return await generateCSRFToken(userId,res)
}