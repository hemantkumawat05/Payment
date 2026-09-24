import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
const userAuth= async(req,res,next)=>
{
    try
    {
        const {token}=req.headers
        if(!token)
        {
            return res.json({
                success:false,
                message:"User not authorize"
            })
        }
        const decode= jwt.verify(token,process.env.JWT_SECRET)
        if(decode && typeof decode==="object" && (decode.id || decode.email))
        {
            req.userId=decode.id
            req.email=decode.email
            return next()
        }
        if(typeof decode==="string")
        {
            const dbuser= await userModel.findOne({})
            if(dbuser)
            {
                req.userId=dbuser._id
                req.email=dbuser.email
                return next()
            }
        }
    }
    catch
    {
        return res.json({
            success:false,
            message:"Session Expired Or Invalid Token. Please Login Again"
        })
    }
}

export default userAuth;