import userModel from "../models/userModel.js";

const transcationdata = async (req, res) => {
    try {
        const userid = req.user?._id || req.userId || req.query.userid;
        if (!userid) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Please provide valid user session"
            });
        }

        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account does not exist"
            });
        }

        const rawTransactions = Array.isArray(user.transactions) ? user.transactions : [];
        // Return transactions with most recent first
        const sortedTransactions = [...rawTransactions].reverse();

        res.status(200).json({
            success: true,
            transcations: sortedTransactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export default transcationdata;
