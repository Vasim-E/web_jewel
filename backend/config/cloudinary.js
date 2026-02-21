import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'jewel_products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    },
});

const deleteFromCloudinary = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) return;

    try {
        // Extract public ID from URL
        // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567/folder/public_id.jpg
        const parts = imageUrl.split('/');
        const fileNameWithExtension = parts.pop();
        const publicIdWithoutExtension = fileNameWithExtension.split('.')[0];
        const folder = parts.pop();
        const publicId = `${folder}/${publicIdWithoutExtension}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
    }
};

export { cloudinary, storage, deleteFromCloudinary };
