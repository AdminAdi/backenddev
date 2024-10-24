import mongoose from 'mongoose';
import { DB_Name } from '../constants.js';  // Adjusted relative path for constants.js

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("MongoDB connection failed", err);
        throw err; // Throw the error to be handled in the main entry
    }
};

export default connectDB;
