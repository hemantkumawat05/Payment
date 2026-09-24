import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};



const userSignUp = async (req, res) => {
    try {
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

        const newUser = new userModel({ name, email, password, amount, pin });
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
        if (user.password !== password) {
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
        const { email, newPassword, oldPassword } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User Not Found" })
        }
        if (user.password !== oldPassword) {
            return res.json({ success: false, message: "Wrong Previous Password" })
        }
        await userModel.findByIdAndUpdate(user._id, { password: newPassword })
        res.json({ success: true, message: "User Credentials Updated Successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}





const getUserProfile = async (req, res) => {
    try {
        let userId = req.userId
        if (!userId) {
            const { token } = req.headers;
            if (!token) {
                return res.json({ success: false, message: "Invalid Token" })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            userId = decoded.id
        }
        const userData = await userModel.findById(userId).select("-password")
        if (!userData) {
            return res.json({ success: false, message: "User Not Found" })
        }
        res.json({ success: true, userData });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export {userSignIn,userSignUp,updateUserCredentials,getUserProfile}