import mongoose from "mongoose";

import { DB_Name } from "../constants";

const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB connected !! DBHOST:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error",error)
        process.exit(1)
    }
}

export default connectDB

