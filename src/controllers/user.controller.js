// Import necessary modules
import { asynchandler } from '../utils/asynchandler.js';
import { Apierror } from '../utils/Apierror.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { Apiresponse } from '../utils/Apiresponse.js';

const generateAccessAndRefreshToken = async(userId) => {
    try {
        await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const  refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBefreSave: false})
        return {accessToken, refreshToken}

    } catch (error) {
        throw new Apierror(500, 'Token generation failed')
    }
}

const app = express();

// Define the registerUser function
const registerUser = asynchandler(async (req, res) => {
    // get the user details from the frontend 
    //validation - not empty 
    //check if user already exist - username , email 
    //check for images,check for avatar
    //upload them to cloudinary, avatar 
    //create user object - create entry in db 
    //remove password and refresh token field 
    //send back the user object
    //check for user creation
    //return res
    const { fullname, email, username, password } = req.body
    console.log(email)

    if (
        [fullname, email, username, password].some((field) => field?.trim() === '')
    ) {
        throw new Apierror(400, 'Please fill in all fields')


    }

    const existeduser = User.findOne({ $or: [{ email }, { username }] })

    if (existeduser) {
        throw new Apierror(400, 'User already exists')
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new Apierror(400, 'Please provide an avatar')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar || !coverImage) {
        throw new Apierror(500, 'Image upload failed')
    }

    User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const awaitedUser = await User.findById(username._id).select('-password -refreshToken')

    if (!awaitedUser) {
        throw new Apierror(500, 'User creation failed')
    }

    res.status(201).json(new Apiresponse(201, awaitedUser))

})

const loginUser = asynchandler(async (req, res) => {
    //req body -> data 
    // username or email 
    //find the user 
    //password check
    //access and refresh token 
    //send cookie 

    const { username, password, email } = req.body

    if (!username || !email) {
        throw new Apierror(400, 'Please provide a username or email')
    }

    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) {
        throw new Apierror(401, 'Invalid credentials')
    }

    const isPasswordValid = await user.isPassword(password)
    if (!isPasswordValid) {
        throw new Apierror(401, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new Apiresponse(200, { user: loggedInUser, accessToken, refreshToken }))


})

const logutUser = asynchandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, 
        { 
            $set: { refreshToken: undefined } 
        },
        {
            new: true,
            
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res

    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new Apiresponse(200, 'Logged out successfully'))
        
}) 

// Use asynchandler if required
app.post('/api/v1/user/register', asynchandler(registerUser));

// Export the registerUser function
export {
    registerUser,
    loginUser,
    logutUser


};
