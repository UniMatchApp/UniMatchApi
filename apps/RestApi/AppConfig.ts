import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import path from 'path';

import { router as indexRouter } from './routes/index';
import { router as docsRouter } from './routes/docs';
import { router as eventRouter } from './routes/event';
import { router as userRouter } from './routes/user';
import { router as matchingRouter } from './routes/matching';
import { router as notificationRouter } from './routes/notifications';
import { router as messageRouter } from './routes/messages';

const app = express();

// Configurar la carpeta "static" para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../static')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rutas
const apiRoute = "/api/v1";
app.use('/', indexRouter);
app.use('/docs', docsRouter);
app.use(`${apiRoute}/events`, eventRouter);
app.use(`${apiRoute}/users`, userRouter);
app.use(`${apiRoute}/matching`, matchingRouter);
app.use(`${apiRoute}/notifications`, notificationRouter);
app.use(`${apiRoute}/messages`, messageRouter);


// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.json({ error: err.message });
});

export default app;
