// import userModel from "../models/userModel.js";

// const checkblance = async (req, res) => {
//     try {
//         const { userid, pin } = req.body;
//         if (!userid) {
//             return res.json({ success: false, message: "UserId is required" });
//         }
//         const user = await userModel.findById(userid);
//         if (!user) {
//             return res.json({ success: false, message: "Invalid UserId" });
//         }
//         if (Number(user.pin) !== Number(pin)) {
//             return res.json({ success: false, message: "Wrong Pin Please Enter Correct Pin" });
//         }
//         return res.json({
//             success: true,
//             balance: user.amount,
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };



// const sendAmount = async (req, res) => {
//     try {
//         const { senderId, reciverid, amount, senderPin } = req.body;
//         if (!senderId || !reciverid || !amount || !senderPin) {
//             return res.json({ success: false, message: "Missing required fields" });
//         }
//         const parsedAmount = Number(amount);
//         if (isNaN(parsedAmount) || parsedAmount <= 0) {
//             return res.json({ success: false, message: "Invalid transaction amount" });
//         }

//         const sender = await userModel.findById(senderId);
//         if (!sender) {
//             return res.json({ success: false, message: "Sender Not Exists" });
//         }

//         if (Number(sender.pin) !== Number(senderPin)) {
//             return res.json({ success: false, message: "Wrong Pin Please Enter Valid Pin" });
//         }
//         if (sender.amount < parsedAmount) {
//             return res.json({ success: false, message: "Insufficient Balance In User Account" });
//         }

//         const reciver = await userModel.findById(reciverid);
//         if (!reciver) {
//             return res.json({ success: false, message: "Reciver Not Exists" });
//         }
//         reciver.amount += parsedAmount;
//         sender.amount -= parsedAmount;

//         if (!Array.isArray(sender.transactions)) {
//             sender.transactions = [];
//         }
//         sender.transactions.push({
//             name: reciver.name,
//             id: reciverid,
//             amount: parsedAmount,
//             send: true,
//             date: new Date()
//         });
//         sender.markModified('transactions');

//         if (!Array.isArray(reciver.transactions)) {
//             reciver.transactions = [];
//         }

//         reciver.transactions.push({
//             name: sender.name,
//             id: senderId,
//             amount: parsedAmount,
//             send: false,
//             date: new Date()
//         });
//         reciver.markModified('transactions');


//         await reciver.save();
//         await sender.save();

//         return res.status(200).json({
//             success: true,
//             message: "Payment Successfull",
//             blance: sender.amount
//         });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// }

// export { checkblance, sendAmount }




import userModel from "../models/userModel.js";

const checkblance = async (req, res) => {
    try {
        // CORRECTION: Standardized to 'userId' (CamelCase) and extracted 'pin'
        const { userId, pin } = req.body;
        
        // CORRECTION: Ensure BOTH fields are validated before querying MongoDB
        if (!userId || !pin) {
            return res.json({ success: false, message: "UserId and Pin are required fields" });
        }
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "Invalid User ID" });
        }
        
        if (Number(user.pin) !== Number(pin)) {
            return res.json({ success: false, message: "Wrong Pin Please Enter Correct Pin" });
        }
        
        return res.json({
            success: true,
            balance: user.amount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const sendAmount = async (req, res) => {
    try {
        const { senderId, reciverid, amount, senderPin } = req.body;
        if (!senderId || !reciverid || !amount || !senderPin) {
            return res.json({ success: false, message: "Missing required fields" });
        }
        const parsedAmount = Number(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.json({ success: false, message: "Invalid transaction amount" });
        }

        const sender = await userModel.findById(senderId);
        if (!sender) {
            return res.json({ success: false, message: "Sender Not Exists" });
        }

        if (Number(sender.pin) !== Number(senderPin)) {
            return res.json({ success: false, message: "Wrong Pin Please Enter Valid Pin" });
        }
        if (sender.amount < parsedAmount) {
            return res.json({ success: false, message: "Insufficient Balance In User Account" });
        }

        const reciver = await userModel.findById(reciverid);
        if (!reciver) {
            return res.json({ success: false, message: "Reciver Not Exists" });
        }
        
        // Adjust arithmetic balances safely
        reciver.amount += parsedAmount;
        sender.amount -= parsedAmount;

        // Clean Array handling structures safely mapped out
        if (!Array.isArray(sender.transactions)) {
            sender.transactions = [];
        }
        sender.transactions.push({
            name: reciver.name,
            id: reciverid,
            amount: parsedAmount,
            send: true,
            date: new Date()
        });
        sender.markModified('transactions');

        if (!Array.isArray(reciver.transactions)) {
            reciver.transactions = [];
        }
        reciver.transactions.push({
            name: sender.name,
            id: senderId,
            amount: parsedAmount,
            send: false,
            date: new Date()
        });
        reciver.markModified('transactions');

        // Atomic saves back to collection records
        await reciver.save();
        await sender.save();

        return res.status(200).json({
            success: true,
            message: "Payment Successfull",
            blance: sender.amount
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { checkblance, sendAmount };
