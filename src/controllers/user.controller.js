// Import necessary modules
import { asynchandler } from '../utils/asynchandler.js';
import { Apierror } from '../utils/Apierror.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Apiresponse } from '../utils/Apiresponse.js';

// Define the registerUser function
const registerUser = asynchandler(async (req, res) => {
    // Get the user details from the frontend
    const { fullname, email, username, password } = req.body;
    
    // Validation - not empty
    if ([fullname, email, username, password].some((field) => field?.trim() === '')) {
        throw new Apierror(400, 'Please fill in all fields');
    }

    // Check if user already exists - username or email
    const existedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existedUser) {
        throw new Apierror(400, 'User already exists');
    }

    // Check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new Apierror(400, 'Please provide an avatar');
    }

    // Upload images to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new Apierror(500, 'Image upload failed');
    }

    // Create user object and save entry in DB
    const newUser = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password, // Ensure password is hashed before saving in real applications
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // Ensure the user was created successfully
    if (!newUser) {
        throw new Apierror(500, 'User creation failed');
    }

    // Send back the user object (excluding sensitive information)
    const awaitedUser = await User.findById(newUser._id).select('-password -refreshToken');
    res.status(201).json(new Apiresponse(201, awaitedUser));
});

// Export the registerUser function
export { registerUser };
