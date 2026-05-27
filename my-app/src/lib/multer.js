import multer from 'multer';

// Configure memory storage
const storage = multer.memoryStorage();

// File filter to accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`));
  }
};

// Create multer instance with limits
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * Wraps multer middleware for Next.js
 * @param {string} fieldName - The field name to accept files from
 * @returns {Promise<{file: {buffer, mimetype, originalname}}>}
 */
export const parseMultipartForm = (fieldName = 'file') => {
  return new Promise((resolve, reject) => {
    return uploadMiddleware.single(fieldName);
  });
};
