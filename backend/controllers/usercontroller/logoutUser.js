import { revokeRefreshToken } from "../../config/generateToken.js";
import trycatch from "../../middelware/trycatch.js";
import { redisClient } from "../../server.js";
import { clearAuthCookies } from "../../config/cookieOptions.js";

export const logoutUser = trycatch(async (req, res) => {
    const userId = req.user._id
    await revokeRefreshToken(userId)
    clearAuthCookies(res)

    await redisClient.del(`user:${userId}`)

    res.json({
        message: "Logged out successfully"
    })
})