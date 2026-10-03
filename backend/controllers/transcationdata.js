// import userModel from "../models/userModel.js"

// const transcationdata=async(req,res)=>
// {
//     try
//     {
//         const {userid}=req.query
//         if(!userid)
//         {
//             return res.status(400).json({
//                 success:false,
//                 message:'UserId Not Valid Please Provide Valid User Id'
//             })
//         }
//         const user=await userModel.findById(userid)
//         if(!user)
//         {
//             return res.status(400).json({
//                 success:false,
//                 message:'useId User Not Exist'
//             })
//         }
//         res.status(200).json({
//             success:true,
//             transcations:user.transactions
//         })
//     }
//     catch(error)
//     {
//         res.status(404).json({
//             success:false,
//             message:error
//         })
//     }
// }

// export default transcationdata



import userModel from "../models/userModel.js";

const transcationdata = async (req, res) => {
    try {
        const userid = req.userId || req.query.userid;
        if (!userid) {
            return res.status(400).json({
                success: false,
                message: 'UserId Not Valid. Please Provide Valid User Id'
            });
        }
        
        const user = await userModel.findById(userid);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User does not exist'
            });
        }
        
        res.status(200).json({
            success: true,
            transcations: user.transactions || [] // Match your frontend 'response.data.transcations'
        });
    }
    catch (error) {
        // FIX: Extract error.message string instead of sending the full error object
        res.status(500).json({ // Changed to 500 for an internal server error
            success: false,
            message: error.message || "Internal Server Error" 
        });
    }
}

export default transcationdata;
