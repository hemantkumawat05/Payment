import userModel from "../models/userModel.js";

const userData=async(req,res)=>
{
    try
    {
        const {excludeId}=req.query
          const data = await userModel.find({ _id: { $ne: excludeId } }).select('name');
        if(!data || data.length===0)
        {
            return res.json({success:false,message:"User Not Found"})
        }
        res.status(200).json({success:true,users:data})
    }
    catch(error)
    {
        return res.status(500).json({ success: false, message: error.message });
    }
}
export default userData