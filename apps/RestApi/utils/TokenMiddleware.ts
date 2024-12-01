import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { dependencies } from '@/apps/RestApi/Dependencies';

export const validateAndRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado o inválido' });
        return;
    }

    const token = authHeader.split(' ')[1];

    console.log('token: ', token);

    try {
        const decoded = dependencies.tokenService.validateToken(token) as jwt.JwtPayload;

        if (!req.body) {
            req.body = {};
        }

        req.body.userId = decoded.id;
        
        console.log('decoded: ', req.body);


        next();
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            const decoded = jwt.decode(token) as jwt.JwtPayload;
            if (decoded) {
                const newToken = dependencies.tokenService.generateToken({ id: decoded.id });
                res.setHeader('Authorization', `Bearer ${newToken}`);
                next();
                return;
            }
        }
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
