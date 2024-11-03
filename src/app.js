import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"; // Make sure to import dotenv to use environment variables
import userRouter from "./routes/user.routes.js"; // Importing user routes

dotenv.config(); // Load environment variables from .env

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Serving static files from the 'public' directory
app.use(cookieParser()); // Cookie parsing middleware

// Routes declaration
app.use("/api/v1/user", userRouter); // Register user routes under '/api/v1/user'

// Export the app for use in other modules (like server.js)
export { app };
