import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { dependencies } from '@/apps/RestApi/Dependencies';
import { UserExistsCommand } from '@/core/uniMatch/user/application/commands/UserExistsCommand';
import { ChangeNotificationTokenCommand } from '@/core/uniMatch/user/application/commands/ChangeNotificationTokenCommand';
import { Result } from '@/core/shared/domain/Result';
import { ErrorHandler } from './ErrorHandler';

const sendErrorResponse = (res: Response, message: string, statusCode: number = 401): void => {
  res.status(statusCode).json({ message });
};

const refreshTokenIfExpired = (error: any, token: string, res: Response, next: NextFunction): boolean => {
  if (error instanceof TokenExpiredError) {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (decoded) {
      const newToken = dependencies.tokenService.generateToken({ id: decoded.id });
      res.setHeader('Authorization', `Bearer ${newToken}`);
      next();
      return true;
    }
  }
  return false;
};

const handleUserExists = (userId: string, fcmtoken: string, next: NextFunction, res: Response): void => {
  const existsCommand = new UserExistsCommand(dependencies.userRepository);
  const changeNotificationTokenCommand = new ChangeNotificationTokenCommand(dependencies.userRepository, dependencies.eventBus);

  existsCommand.run(userId).then((result: Result<boolean>) => {
    if (result.isSuccess() && result.getValue()) {
      changeNotificationTokenCommand.run({ userId, notificationToken: fcmtoken })
        .then((result: Result<void>) => {
          if (result.isSuccess()) {
            next();
          } else {
            const error = result.getError();
            ErrorHandler.handleError(error, res);
          }
        });
    } else {
      const error = result.getError();
      ErrorHandler.handleError(error, res);
    }
  });
};

export const validateAndRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const fcmToken = req.headers['x-fcm-token'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 'Token de autenticación no proporcionado o inválido');
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!fcmToken) {
    sendErrorResponse(res, 'Token FCM no proporcionado');
    return;
  }

  try {
    const decoded = dependencies.tokenService.validateToken(token) as jwt.JwtPayload;

    req.body = req.body || {};
    req.body.userId = decoded.id;
    req.body.fcmtoken = fcmToken;

    handleUserExists(req.body.userId, req.body.fcmtoken, next, res);
  } catch (error: any) {
    if (!refreshTokenIfExpired(error, token, res, next)) {
      sendErrorResponse(res, 'Token inválido o expirado');
    }
  }
};

