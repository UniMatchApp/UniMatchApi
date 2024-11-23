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

    try {
        const decoded = dependencies.tokenService.validateToken(token) as jwt.JwtPayload;

        const routeId = req.params.id;

        if (!routeId) {
            res.status(400).json({ message: 'ID no proporcionado en la ruta' });
            return;
        }

        if (decoded.id !== routeId) {
            res.status(403).json({ message: 'No autorizado: el ID no coincide' });
            return;
        }

        next();
    } catch (error: any) {
        if (error instanceof TokenExpiredError) {
            const decoded = jwt.decode(token) as jwt.JwtPayload;
            console.log("decoded", decoded);
            if (decoded && decoded.id === req.params.id) {
                const newToken = dependencies.tokenService.generateToken({ id: decoded.id });
                res.setHeader('Authorization', `Bearer ${newToken}`);
                next();
                return;
            }
        }

        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
