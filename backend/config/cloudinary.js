import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn("WARNING: Cloudinary credentials missing in .env. Product image uploads will fall back to mockup image URLs.");
        return;
    }
    
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("Cloudinary Configured Successfully");
    } catch (error) {
        console.error("Cloudinary configuration failed:", error);
    }
};

export default connectCloudinary;
