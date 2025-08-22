const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// Configure Cloudinary (optional - will use local storage if not configured)
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload file to Cloudinary or save locally
 * @param {Object} file - File object from multer
 * @param {string} folder - Folder name for organization
 * @returns {Promise<Object>} Upload result with URL and public_id
 */
const uploadFile = async (file, folder = 'general') => {
  try {
    // If Cloudinary is configured, use it
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `dsa-mastery/${folder}`,
        resource_type: 'auto',
        transformation: [
          { width: 500, height: 500, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      // Clean up local file
      fs.unlinkSync(file.path);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        provider: 'cloudinary'
      };
    } else {
      // Use local storage
      const uploadDir = path.join(__dirname, '../../uploads', folder);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      
      // Move file to uploads directory
      fs.renameSync(file.path, filePath);

      return {
        url: `/uploads/${folder}/${fileName}`,
        public_id: fileName,
        provider: 'local'
      };
    }
  } catch (error) {
    logger.error('File upload error:', error);
    throw new Error('File upload failed');
  }
};

/**
 * Delete file from Cloudinary or local storage
 * @param {string} public_id - Public ID or filename
 * @param {string} provider - Storage provider ('cloudinary' or 'local')
 * @returns {Promise<boolean>} Success status
 */
const deleteFile = async (public_id, provider = 'local') => {
  try {
    if (provider === 'cloudinary' && process.env.CLOUDINARY_CLOUD_NAME) {
      await cloudinary.uploader.destroy(public_id);
    } else {
      // Delete local file
      const filePath = path.join(__dirname, '../../uploads', public_id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return true;
  } catch (error) {
    logger.error('File deletion error:', error);
    return false;
  }
};

/**
 * Upload image with specific transformations
 * @param {Object} file - File object from multer
 * @param {string} folder - Folder name
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
const uploadImage = async (file, folder = 'images', options = {}) => {
  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `dsa-mastery/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: options.width || 500, height: options.height || 500, crop: 'limit' },
          { quality: 'auto' }
        ],
        ...options
      });

      fs.unlinkSync(file.path);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        provider: 'cloudinary'
      };
    } else {
      return await uploadFile(file, folder);
    }
  } catch (error) {
    logger.error('Image upload error:', error);
    throw new Error('Image upload failed');
  }
};

/**
 * Generate upload URL for direct uploads
 * @param {string} folder - Folder name
 * @returns {Promise<string>} Upload URL
 */
const generateUploadUrl = async (folder = 'general') => {
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: `dsa-mastery/${folder}` },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/auto/upload`,
      params: {
        timestamp,
        signature,
        folder: `dsa-mastery/${folder}`
      }
    };
  } else {
    return {
      url: `/api/upload/${folder}`,
      method: 'POST'
    };
  }
};

module.exports = {
  uploadFile,
  uploadImage,
  deleteFile,
  generateUploadUrl,
  cloudinary
};
