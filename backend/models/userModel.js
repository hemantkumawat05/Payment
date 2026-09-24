import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    amount:{type:Number,required:true,default:10000},
    pin:{type:Number,required:true,default:1234,},
    transactions:{type:Object,default:{}}
},{minimize:false})

const userModel=mongoose.models.user || mongoose.model("user",userSchema)

export default userModel;