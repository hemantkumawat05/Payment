import userModel from "../models/userModel.js";
import { redisClient } from "../server.js";

const checkblance = async (req, res) => {
    try {
        const { pin } = req.body;
        const targetUserId = req.user?._id || req.userId || req.body.userId;

        if (!targetUserId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!pin && pin !== 0) {
            return res.status(400).json({ success: false, message: "6-Digit PIN is required" });
        }

        const user = await userModel.findById(targetUserId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found" });
        }

        if (Number(user.pin) !== Number(pin) && user.pin?.toString() !== pin?.toString()) {
            return res.status(400).json({ success: false, message: "Wrong PIN. Please enter correct 6-digit PIN" });
        }

        return res.json({
            success: true,
            balance: user.amount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const sendAmount = async (req, res) => {
    try {
        const { reciverid, amount, senderPin } = req.body;
        const actualSenderId = req.user?._id || req.userId || req.body.senderId;

        if (!actualSenderId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (!reciverid || !amount || (!senderPin && senderPin !== 0)) {
            return res.status(400).json({ success: false, message: "Recipient, amount, and 6-digit PIN are required" });
        }

        if (actualSenderId.toString() === reciverid.toString()) {
            return res.status(400).json({ success: false, message: "Cannot send money to yourself" });
        }

        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid transaction amount" });
        }

        const sender = await userModel.findById(actualSenderId);
        if (!sender) {
            return res.status(404).json({ success: false, message: "Sender account not found" });
        }

        if (Number(sender.pin) !== Number(senderPin) && sender.pin?.toString() !== senderPin?.toString()) {
            return res.status(400).json({ success: false, message: "Wrong PIN. Please enter valid 6-digit PIN" });
        }

        if (sender.amount < parsedAmount) {
            return res.status(400).json({ success: false, message: "Insufficient balance in your wallet account" });
        }

        const reciver = await userModel.findById(reciverid);
        if (!reciver) {
            return res.status(404).json({ success: false, message: "Recipient account does not exist" });
        }

        // Update balances
        reciver.amount += parsedAmount;
        sender.amount -= parsedAmount;

        // Ensure transactions arrays exist
        if (!Array.isArray(sender.transactions)) {
            sender.transactions = [];
        }
        sender.transactions.push({
            name: reciver.name,
            id: reciver._id.toString(),
            amount: parsedAmount,
            send: true,
            date: new Date()
        });
        sender.markModified('transactions');

        if (!Array.isArray(reciver.transactions)) {
            reciver.transactions = [];
        }
        reciver.transactions.push({
            name: sender.name,
            id: sender._id.toString(),
            amount: parsedAmount,
            send: false,
            date: new Date()
        });
        reciver.markModified('transactions');

        await reciver.save();
        await sender.save();

        // Invalidate Redis caches so user profile & balance updates immediately
        try {
            await redisClient.del(`user:${actualSenderId}`);
            await redisClient.del(`user:${reciver._id}`);
        } catch (cacheErr) {
            console.error("Cache invalidation notice:", cacheErr.message);
        }

        return res.status(200).json({
            success: true,
            message: "Payment Successful",
            blance: sender.amount,
            balance: sender.amount
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { checkblance, sendAmount };
