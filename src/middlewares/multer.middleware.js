import multer from 'multer';
import fs from 'fs';
import Setting from '../config/multer.js';

/**
 * Creates a multer storage engine with the given upload path.
 * @param {string} prefixPath
 * @param {string} uploadPath
 * @returns {multer.StorageEngine}
 */
const createStorage = (prefixPath, uploadPath, context = 'RNDM') => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const fullPath = prefixPath + uploadPath;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName =
        uniqueSuffix +
        '_' +
        `${context}-${file.fieldname}-${req?.user ? req.user.id : 'None'}-${file.originalname}`;
      cb(null, fileName);
    },
  });
};

/**
 * Creates a file filter function for multer based on allowed MIME types.
 * @param {'image' | 'file' | 'video' | '*'} mime
 * @returns {multer.FileFilterCallback}
 */
const createFilter = (mime) => {
  return (req, file, cb) => {
    let allowedMimes = [];

    switch (mime) {
      case 'image':
        allowedMimes = Setting.allowedImageMimes;
        break;
      case 'file':
        allowedMimes = Setting.allowedFileMimes;
        break;
      case 'video':
        allowedMimes = Setting.allowedVideoMimes;
        break;
      case '*':
        allowedMimes = [
          ...Setting.allowedImageMimes,
          ...Setting.allowedFileMimes,
          ...Setting.allowedVideoMimes,
        ];
        break;
      default:
        return cb(new Error('Invalid mime type specified'), false);
    }

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const allowedExtensions = allowedMimes
        .map((mim) => mim.split('/')[1])
        .join(', ');
      cb(new Error(`Please upload only ${allowedExtensions} files.`), false);
    }
  };
};

/**
 * Creates a multer uploader middleware with the given options.
 * @param {string} uploadPath
 * @param {'image' | 'file' | 'video' | '*'} fileType
 * @param {number} [limitSize=Setting.defaultLimitSize]
 * @returns {multer.Multer}
 */
const uploader = (
  uploadPath = '/others',
  fileType = 'image',
  context = 'RNDM',
  limitSize = Setting.defaultLimitSize
) => {
  const storage = createStorage('./uploads', uploadPath, context);
  const fileFilter = createFilter(fileType);

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: limitSize },
  });
};

/**
 * Creates a multer uploader to public middleware with the given options.
 * @param {string} uploadPath
 * @param {'image' | 'file' | 'video' | '*'} fileType
 * @param {number} [limitSize=Setting.defaultLimitSize]
 * @returns {multer.Multer}
 */
const uploadPublic = (
  uploadPath = '/others',
  fileType = 'image',
  context = 'RNDM',
  limitSize = Setting.defaultLimitSize
) => {
  const storage = createStorage('./public', uploadPath, context);
  const fileFilter = createFilter(fileType);

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: limitSize },
  });
};

/**
 * Creates a multer uploader to public middleware with the given options.
 * @param {string} uploadPath
 * @param {'image' | 'file' | 'video' | '*'} fileType
 * @param {number} [limitSize=Setting.defaultLimitSize]
 * @returns {multer.Multer}
 */
const uploadSingle = (
  uploadPath = '/others',
  fileType = 'image',
  context = 'RNDM',
  limitSize = Setting.defaultLimitSize
) => {
  const storage = createStorage('./upload', uploadPath, context);
  const fileFilter = createFilter(fileType);

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: limitSize },
  });
};



export default uploader;
export { uploadPublic };
export { uploadSingle };
