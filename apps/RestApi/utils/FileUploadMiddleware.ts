import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('thumbnail')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(400).send('Error uploading file.');
    }

    if (req.file) {
      const multerFile = req.file;

      const file = new File([multerFile.buffer], multerFile.originalname, {
        type: multerFile.mimetype,
      });

      req.body.attachment = file;
      next();
    } else {
      next();
    }
  });
};

export default fileUploadMiddleware;
