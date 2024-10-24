import dotenv from 'dotenv';
import mongoose from "mongoose";
import { DB_Name } from "./constants.js"; // Correctly import with .js extension
import express from "express";
const app = express();


dotenv.config({
    path: './env' // Make sure this points to your .env file
});

// Database connection
import connectDB from "./db/index.js"; // Ensure this path is correct
connectDB();

// Uncomment this section to start the server and connect to MongoDB
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        app.on("error", (error) => {
            console.log("ERR", error);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Process is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("ERROR", error);
        throw error;
    }
})();
