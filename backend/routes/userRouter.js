import express from "express";
const userRouter = express.Router();
import { userSignIn, userSignUp, updateUserCredentials, getUserProfile } from "../controllers/userController.js";
import userData from "../controllers/userData.js";

import registeruser from "../controllers/usercontroller/registeruser.js";
import { refreshToken, verifyUser } from "../controllers/usercontroller/verifyUser.js";
import { loginUser } from "../controllers/usercontroller/loginUser.js";
import verifyOtp from "../controllers/usercontroller/verifyOtp.js";
import isAuth from "../middelware/isAuth.js";
import myProfile from "../controllers/usercontroller/myProfile.js";
import { logoutUser } from "../controllers/usercontroller/logoutUser.js";
import { verifyCSRFToken } from "../config/csrfMiddelware.js";
import { refreshCSRF } from "../controllers/usercontroller/refreshCSRF.js";

// Public auth endpoints
userRouter.post("/register", registeruser);
userRouter.post("/verify/:token", verifyUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify", verifyOtp);
userRouter.post("/refresh", refreshToken);

// Legacy authentication (fallback)
userRouter.post("/signin", userSignIn);
userRouter.post("/signup", userSignUp);

// Authenticated endpoints protected by isAuth & CSRF token
userRouter.get("/myprofile", isAuth, myProfile);
userRouter.get("/profile", isAuth, getUserProfile);
userRouter.get("/userdata", isAuth, userData);
userRouter.post("/update", isAuth, verifyCSRFToken, updateUserCredentials);
userRouter.post("/logout", isAuth, verifyCSRFToken, logoutUser);
userRouter.post("/refresh-csrf", isAuth, refreshCSRF);

export default userRouter;