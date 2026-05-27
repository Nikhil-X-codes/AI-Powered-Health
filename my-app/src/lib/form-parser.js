import { uploadMiddleware } from './multer';

/**
 * Parse multipart form data and extract file
 * @param {Request} request - NextRequest object
 * @param {string|string[]} fieldName - Field name(s) to extract file from
 * @returns {Promise<{file: {buffer, mimetype, originalname}, fields: object}>}
 */
export const parseFormData = async (request, fieldName = 'file') => {
  try {
    const formData = await request.formData();

    const fieldNames = Array.isArray(fieldName) ? fieldName : [fieldName];
    let file = null;
    let usedField = null;

    for (const name of fieldNames) {
      file = formData.get(name);
      if (file) {
        usedField = name;
        break;
      }
    }

    if (!file) {
      throw new Error(`No file found in field: ${fieldNames.join(', ')}`);
    }

    // Extract other form fields
    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (key !== usedField) {
        fields[key] = value;
      }
    }

    // Convert File to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    return {
      file: {
        buffer,
        mimetype: file.type,
        originalname: file.name,
      },
      fields,
    };
  } catch (error) {
    console.error('Error parsing form data:', error);
    throw error;
  }
};

/**
 * Validate file type
 * @param {string} mimeType - MIME type of file
 * @param {string[]} allowedTypes - Array of allowed MIME types
 */
export const validateFileType = (mimeType, allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
]) => {
  return allowedTypes.includes(mimeType);
};

/**
 * Validate file size
 * @param {number} fileSize - Size of file in bytes
 * @param {number} maxSize - Maximum allowed size in bytes (default: 50MB)
 */
export const validateFileSize = (fileSize, maxSize = 50 * 1024 * 1024) => {
  return fileSize <= maxSize;
};
