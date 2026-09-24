import express from "express"
const userRouter=express.Router();
import { userSignIn,userSignUp,updateUserCredentials,getUserProfile } from "../controllers/userController.js";
import userAuth from "../middelware/userAuth.js";
userRouter.post("/signin",userSignIn)
userRouter.post("/signup",userSignUp)
userRouter.post("/update",userAuth,updateUserCredentials)
userRouter.get("/profile",userAuth,getUserProfile)


export default userRouter