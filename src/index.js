import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db/index.js';  // Importing from db folder

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDB()
    .then(() => {
        // Start the server after DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to DB or start server", err);
        process.exit(1); // Exit on failure
    });
