import express, { Router } from "express"
const transactionRoute=express.Router();
import { checkblance,sendAmount } from "../controllers/transController.js";
import userAuth from "../middelware/userAuth.js";

transactionRoute.get("/balance",checkblance)
transactionRoute.get("/sendamount",userAuth,sendAmount)


export default transactionRoute;