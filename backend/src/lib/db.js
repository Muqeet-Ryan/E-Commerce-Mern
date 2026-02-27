import mongoose from "mongoose";
import "dotenv/config";


export const connectDB = async() => {

    try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connection is live');
    } catch (error) {
    console.error('DB connection has failed', error);
    process.exit(1);
    }

}