import { Request, Response, Router } from 'express';
import path from 'path';

const router = Router();

/* GET home page. */
router.get('', (req: Request, res: Response) => {
    // Usa path.join para construir la ruta completa al archivo index.html
    res.sendFile(path.join(__dirname, '../../static/index.html'));
});

export { router };
