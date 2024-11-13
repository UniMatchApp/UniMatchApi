import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const fileUploadMiddleware = upload.single('file');

export default fileUploadMiddleware;
