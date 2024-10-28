import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadImage = async (path) => {
    try {
        if (path) return null
        //uploading the file on cloudinary
        const response = await cloudinary.uploader.upload(path, {

            resource_type: 'auto',
        });
        //file uploaded successfully
        console.log("file uploaded successfully", response.url);
        return response

    } catch (error) {
        fs.unlink(path)//remove the locally saved temp file as the upload operation got failed
        return null

    }
}


export { uploadOnCloudinary }