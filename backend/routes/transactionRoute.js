import express from "express";
const transactionRoute = express.Router();
import isAuth from "../middelware/isAuth.js";
import { verifyCSRFToken } from "../config/csrfMiddelware.js";
import transcationdata from "../controllers/transcationdata.js";
import { checkblance, sendAmount } from "../controllers/transController.js";

// Check balance requires authentication and CSRF token protection
transactionRoute.post("/balance", isAuth, verifyCSRFToken, checkblance);

// Send amount requires authentication and CSRF token protection
transactionRoute.post("/sendamount", isAuth, verifyCSRFToken, sendAmount);

// Fetch transaction history requires authentication (GET request)
transactionRoute.get("/transactionsdata", isAuth, transcationdata);

export default transactionRoute;