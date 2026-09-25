import userModel from "../models/userModel.js";

const checkblance=async (req,res)=>
{
    const {userid,pin}=req.body;
    const user=await userModel.findById({userid})
    if(!user)
    {
        return res.json({success:false,message:"Invalid UserId"})
    }
    if(user.pin!==pin)
    {
        return res.json({success:false,message:"Wrong Pin Please Enter Correct Pin"})
    }
    return res.json({
        success:true,
        balance:user.amount,
    })
}

const sendAmount= async (req,res)=>
{
    const {senderId,reciverId,amount,senderPin}=req.body
    const sender=await userModel.findById(senderId)
    if(!sender)
    {
        return res.send({success:false,message:"Sender Not Exists"})
    }
    if(sender.pin!==senderPin)
    {
        return res.json({success:false,message:"Wrong Pin Please Enter Valid Pin"})
    }
    if(sender.amount<amount)
    {
        return res.json({success:false,message:"Insufficient Balance In User Account"})
    }
    const reciver=await userModel.findById(reciverId)
    if(!reciver)
    {
        return res.json({success:false,message:"Reciver Not Exists"})
    }
    reciver.amount+=amount
    sender.amount-=amount
    reciver.save()
    sender.save()

    res.json({success:true,message:"Payment Successfull",blance:sender.amount})
}

export {checkblance,sendAmount}