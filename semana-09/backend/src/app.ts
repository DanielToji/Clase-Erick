// File Path: ./semana-07/backend/src/app.ts

import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.routes.js';
import { roomsRouter } from './routes/rooms.routes.js';
import { roomTypesRouter } from './routes/room-types.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { logger, morganStream } from './config/logger.js';

export const app = express();

app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(morgan(':method :url :status :response-time ms', { stream: morganStream }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/room-types', roomTypesRouter);
app.use('/api/v1/rooms', roomsRouter);

app.use(notFound);
app.use(errorHandler);

logger.debug('Express app composed');