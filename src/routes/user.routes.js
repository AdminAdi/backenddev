import { Router } from 'express';
import { registerUser } from '../controllers/user.controller.js'; // Ensure .js extension
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { refreshAccessToken } from '../controllers/user.controller.js';

const router = Router();

// POST route for user registration
router.post("/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]), 
    registerUser
);

router.route("/login").post(loginUser);

//secured routes 

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refreshToken").post(refreshToken);



export default router;
