import mongoose from "mongoose";

const blanceSchema= new mongoose.Schema
({
    sender_id:{type:Object._id,required:true},
    reciver_id:{type:Object._id,required:true},
    amount_send:{type:Number,required:true},
    tranjaction_date:{type:Date,default:new Date()},
})
const blanceModel=mongoose.models.blance || mongoose.model("blance",blanceSchema)

export default blanceModel;