import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"
import { redisClient } from "../server.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};


let userID=0
const userSignUp = async (req, res) => {
    try {
        // const userID=0
        userID=userID+1
        console.log(userID)
        const { name, email, pin, amount, password } = req.body;
        if (!name || !email || !pin || !password || !amount) {
            return res.json({ success: false, message: "required All Details" })
        }
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User Alredy Exists" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email-Id" })
        }
        if (password.length < 6) {
            return res.json({ success: false, message: "Please Enter Strong Password" })
        }

        const newUser = new userModel({ name, email, password, amount, pin,userID });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, message: "New User Added", token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}




const userSignIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password);
        } catch (e) {
            isMatch = false;
        }
        if (!isMatch && user.password === password) {
            isMatch = true;
        }
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = createToken(user._id);
        res.json({ success: true, message: "User Logged In Successfully", token })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}






const updateUserCredentials = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;
        const { currentPin, newPin, oldPassword, newPassword, email } = req.body;

        let user = null;
        if (userId) {
            user = await userModel.findById(userId);
        } else if (email) {
            user = await userModel.findOne({ email });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User Account Not Found" });
        }

        const updated = [];

        // Handle PIN update
        if (newPin !== undefined && newPin !== "") {
            if (currentPin === undefined || currentPin === "") {
                return res.status(400).json({ success: false, message: "Current 6-digit PIN is required to set new PIN" });
            }
            if (Number(user.pin) !== Number(currentPin) && user.pin?.toString() !== currentPin?.toString()) {
                return res.status(400).json({ success: false, message: "Incorrect current PIN" });
            }
            const pinStr = newPin.toString();
            if (pinStr.length !== 6 || isNaN(Number(pinStr))) {
                return res.status(400).json({ success: false, message: "New PIN must be exactly 6 digits" });
            }
            user.pin = Number(newPin);
            updated.push("Transaction PIN");
        }

        // Handle Password update
        if (newPassword !== undefined && newPassword !== "") {
            if (!oldPassword) {
                return res.status(400).json({ success: false, message: "Current password is required to set new password" });
            }
            let isMatch = false;
            try {
                isMatch = await bcrypt.compare(oldPassword, user.password);
            } catch (e) {
                isMatch = false;
            }
            if (!isMatch && user.password === oldPassword) {
                isMatch = true;
            }
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Incorrect current password" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            updated.push("Password");
        }

        if (updated.length === 0) {
            return res.status(400).json({ success: false, message: "No valid update fields provided" });
        }

        await user.save();

        // Invalidate Redis cache
        try {
            await redisClient.del(`user:${user._id}`);
        } catch (cacheErr) {
            console.error("Cache invalidation error:", cacheErr);
        }

        return res.json({
            success: true,
            message: `${updated.join(" and ")} updated successfully!`
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}





const getUserProfile = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }
        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }
        res.json({ success: true, userData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export {userSignIn,userSignUp,updateUserCredentials,getUserProfile}