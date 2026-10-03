import express, { Router } from "express"
const transactionRoute=express.Router();
import { checkblance,sendAmount } from "../controllers/transController.js";
import userAuth from "../middelware/userAuth.js";
import transcationdata from "../controllers/transcationdata.js";

transactionRoute.post("/balance",userAuth,checkblance)
transactionRoute.post("/sendamount",userAuth,sendAmount)
transactionRoute.get('/transactionsdata',userAuth,transcationdata)


export default transactionRoute;