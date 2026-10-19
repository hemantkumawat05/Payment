import jwt from "jsonwebtoken"
import { redisClient } from "../../server.js"
import { getCookieOptions } from "../../config/cookieOptions.js"

const verifyRefreshToken = async (refreshToken) => {
    try {

        const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET)

        const storedToken = await redisClient.get(`refresh_token:${decode.id}`)

        // if (storedToken == refreshToken) 
        // {
        //     return decode
        // }
        // return null

        if (storedToken !== refreshToken) {
            return null
        }

        const activeSessionId = await redisClient.get(`active_session:${decode.id}`)

        if (activeSessionId !== decode.sessionId) {
            return null
        }

        const sessionData = await redisClient.get(`session:${decode.sessionId}`)

        if (!sessionData) {
            return null
        }
        const parsedSessionData = JSON.parse(sessionData)
        parsedSessionData.lastActivity = new Date().toISOString()

        await redisClient.setEx(`session:${decode.sessionId}`, 7 * 24 * 60 * 60, JSON.stringify(parsedSessionData))

        return decode
    }
    catch (error) {
        return null
    }

}

export default verifyRefreshToken



export const generateAccessToken = (id, sessionId, res) => {
    const accessToken = jwt.sign({ id, sessionId }, process.env.JWT_SECRET, { expiresIn: "15m" })
    res.cookie("accessToken", accessToken, getCookieOptions({
        maxAge: 15 * 60 * 1000
    }))
}



