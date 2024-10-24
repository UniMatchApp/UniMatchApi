import {NextFunction, Request, Response, Router} from 'express';

const router = Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.redirect('/docs')
});

export {router};
