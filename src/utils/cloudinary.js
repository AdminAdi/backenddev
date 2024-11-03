import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Make sure API secret is set in your .env file
});

const uploadImage = async (path) => {
    try {
        if (!path) return null;  // Corrected: Only proceed if the path exists

        // Uploading the file on Cloudinary
        const response = await cloudinary.uploader.upload(path, {
            resource_type: 'auto',
        });

        // File uploaded successfully
        console.log("File uploaded successfully:", response.url);
        return response;

    } catch (error) {
        // Remove the locally saved temp file if the upload fails
        fs.unlinkSync(path);  // Added Sync to ensure file is removed immediately
        console.error("Error uploading file:", error);
        return null;
    }
};

export { uploadImage };  // Corrected function name to match what was defined
