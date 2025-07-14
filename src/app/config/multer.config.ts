const { memoryStorage } = require('multer');

export const pdfUploadConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('pdf')) {
      return cb(new Error('Only PDF files are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
};

export const avatarUploadConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif)$/)) {
      return cb(new Error('Only image files (jpeg, png, jpg, gif) are allowed'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 6 * 1024 * 1024 // 6MB - reasonable size for avatars
  }
}; 