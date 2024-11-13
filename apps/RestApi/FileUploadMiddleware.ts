import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const fileUploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).send('Error uploading file.');
    }

    if (req.file) {
      const multerFile = req.file; 

      const file = new File([multerFile.buffer], multerFile.originalname, {
        type: multerFile.mimetype,
      });

      req.body.attachment = file;
      next();
    }
  });
};

export default fileUploadMiddleware;
