import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js'; // Ensure .js extension
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// POST route for user registration
router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]), 
    registerUser
);

export default router;
