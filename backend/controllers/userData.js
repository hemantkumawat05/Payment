import userModel from "../models/userModel.js";

const userData = async (req, res) => {
    try {
        const excludeId = req.user?._id || req.userId || req.query.excludeId;
        const filter = excludeId ? { _id: { $ne: excludeId } } : {};
        const data = await userModel.find(filter).select('name email amount createdAt');
        res.status(200).json({ success: true, users: data || [] });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default userData;