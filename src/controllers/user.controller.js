// Import necessary modules
import { asynchandler } from '../utils/asynchandler.js';
import express from 'express';

const app = express();

// Define the registerUser function
const registerUser = (req, res) => {
    // Handle registration logic here
    res.status(200).json({
        message: "ok"
    });
};

// Use asynchandler if required
app.post('/api/v1/user/register', asynchandler(registerUser));

// Export the registerUser function
export { registerUser };
