import multer from 'multer';
import fs from 'fs';
import { BadRequest, catchResponse } from '../exceptions/catch.execption.js';

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @returns {multer.StorageEngine}
 */
const createStorage = (basePath, subPaths) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const fullPath = basePath + subPaths;
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.fieldname}-${req.user?.id ?? 'null'}-${file.originalname}`;
      cb(null, fileName);
    },
  });
};

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @param {{
 * name: string,
 * mimeTypes: (
 * 'image/jpeg' |
 * 'image/jpg' |
 * 'image/png' |
 * 'video/mp4' |
 * 'video/webm' |
 * 'application/pdf' |
 * 'application/msword')[]
 * maxCount?: number,
 * limitSize?: number
 * }[]} fields
 */
const uploadMany =
  (basePath = './public', subPaths, fields) =>
  (req, res, next) => {
    const upload = multer({
      storage: createStorage(basePath, subPaths),
    }).fields(fields.map(({ name, maxCount }) => ({ name, maxCount })));

    upload(req, res, (err) => {
      if (err) return next(new BadRequest(err.message ?? 'Gagal mengunggah'));

      for (const field of fields) {
        const files = req.files?.[field.name];
        if (files) {
          for (const file of files) {
            // default 2mb
            if (file.size > (field.limitSize ?? 2000000))
              return next(
                new BadRequest(`Ukuran ${field.name} melebihi batas.`)
              );

            if (!field.mimeTypes.includes(file.mimetype))
              return next(new BadRequest(`Format ${field.name} tidak sesuai.`));
          }
        }
      }

      next();
    });
  };

export { uploadMany };
