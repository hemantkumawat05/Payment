import jwt from "jsonwebtoken"
import { redisClient } from "../server.js"
import { generateCSRFToken, revokCSRFToken } from "./csrfMiddelware.js"
import crypto from "crypto"
import { getCookieOptions } from "./cookieOptions.js"

export const generateToken=async(id,res)=>
{
    const sessionId=crypto.randomBytes(16).toString("hex")

    const accessToken=jwt.sign({id,sessionId},process.env.JWT_SECRET,{expiresIn:"15m"})

    const refreshToken=jwt.sign({id,sessionId},process.env.REFRESH_SECRET,{expiresIn:"7d"})

    const refreshTokenKey=`refresh_token:${id}`

    const activeSessionKey=`active_session:${id}`
    const sessionDataKey=`session:${sessionId}`

    const existingSession=await redisClient.get(activeSessionKey)
    if(existingSession)
    {
        await redisClient.del(`session:${existingSession}`)
        await redisClient.del(refreshTokenKey)
    }
    const sessionData=
    {
        userId:id,
        sessionId,
        createdAt:new Date().toISOString(),
        lastActivity:new Date().toISOString()
    }

    await redisClient.setEx(refreshTokenKey,7*24*60*60,refreshToken)//save for 7 Days
    await redisClient.setEx(activeSessionKey,7*24*60*60,sessionId)
    await redisClient.setEx(sessionDataKey,7*24*60*60,JSON.stringify(sessionData))

    res.cookie("accessToken",accessToken,getCookieOptions({
        maxAge:15*60*1000
    }))

    res.cookie("refreshToken",refreshToken,getCookieOptions({
        maxAge:7*24*60*60*1000
    }))

    const csrfToken=await generateCSRFToken(id,res)

    return {accessToken,refreshToken,csrfToken,sessionId}
}



export const revokeRefreshToken=async(userId)=>
{
    const activeSessionId=await redisClient.get(`active_session:${userId}`)
    await redisClient.del(`refresh_token:${userId}`)
    await redisClient.del(`active_session:${userId}`)

    if(activeSessionId)
    {
        await redisClient.del(`session:${activeSessionId}`)
    }

    await redisClient.del(`refresh_token:${userId}`)
    await revokCSRFToken(userId)
}


export const isSessionActive=async(userId,sessionId)=>
{
    const activeSessionId=await redisClient.get(`active_session:${userId}`)

    return activeSessionId===sessionId
}