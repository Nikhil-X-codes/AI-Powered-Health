import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};

cloudinary.config(cloudinaryConfig);

const hasCloudinaryConfig = () => {
  return Boolean(
    cloudinaryConfig.cloud_name &&
    cloudinaryConfig.api_key &&
    cloudinaryConfig.api_secret
  );
};

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} fileName - Original file name
 * @param {string} folder - Cloudinary folder path
 * @param {string} resourceType - Type of resource (auto, image, video, raw, etc.)
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadToCloudinary = (fileBuffer, fileName, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    if (!hasCloudinaryConfig()) {
      reject(new Error('Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'));
      return;
    }

    const cleanedName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const publicId = `${uniqueId}-${cleanedName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: resourceType,
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          const message = error?.message || error?.error?.message || String(error);
          reject(new Error(`Cloudinary upload failed: ${message}`));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the resource
 * @param {string} resourceType - Type of resource
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};
