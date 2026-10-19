import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('MongoDB Connected'))
        await mongoose.connect(`${process.env.MONGODB_URL}`, { dbName: 'Paytm' })

    }
    catch (error) {
        console.log("Failed to connect database")
    }
}

export default connectDB