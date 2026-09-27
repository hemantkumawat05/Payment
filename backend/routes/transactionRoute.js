import express, { Router } from "express"
const transactionRoute=express.Router();
import { checkblance,sendAmount } from "../controllers/transController.js";
import userAuth from "../middelware/userAuth.js";

transactionRoute.post("/balance",checkblance)
transactionRoute.post("/sendamount",sendAmount)


export default transactionRoute;