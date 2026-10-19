import trycatch from "../../middelware/trycatch.js";
import { redisClient } from "../../server.js";
import userModel from "../../models/userModel.js";

const myProfile = trycatch(async (req, res) => {
    const userId = req.user?._id || req.userId;
    // Retrieve fresh user from DB to ensure latest balance and info
    const dbUser = await userModel.findById(userId).select("-password");
    const user = dbUser || req.user;

    const sessionId = req.sessionId;
    const sessionData = await redisClient.get(`session:${sessionId}`);
    let sessionInfo = null;

    if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        sessionInfo = {
            sessionId,
            loginTime: parsedSession.createdAt,
            lastActivity: parsedSession.lastActivity,
        };
    }

    res.json({
        success: true,
        user,
        sessionInfo
    });
});

export default myProfile;