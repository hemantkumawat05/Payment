import { generateCSRFToken } from "../../config/csrfMiddelware.js";
import trycatch from "../../middelware/trycatch.js";

export const refreshCSRF = trycatch(async (req, res) => {
    const userId = req.user._id

    const newCSRFToken = await generateCSRFToken(userId, res)

    res.json({
        message: "CSRF Token refreshed scuccessfully",
        csrfToken: newCSRFToken
    })

})