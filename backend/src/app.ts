// File Path: ./semana-03/backend/src/app.ts

import express, { type NextFunction, type Request, type Response } from 'express';
import { roomsRouter } from './routes/rooms.routes.js';
import { HttpError } from './errors/HttpError.js';
import type { ErrorResponse } from './types.js';

export const app = express();

app.use(express.json({ limit: '100kb' }));

app.use('/api/v1/rooms', roomsRouter);

/** 404 uniforme para rutas no registradas. */
app.use((req: Request, res: Response<ErrorResponse>) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/** Error handler central. Debe declarar 4 parámetros para que Express lo reconozca. */
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
  ) => {
    if (err instanceof HttpError) {
      res.status(err.statusCode).json({ error: err.name, message: err.message });
      return;
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unexpected error',
    });
  },
);