// File Path: ./semana-09/backend/src/middlewares/notFound.ts

import type { NextFunction, Request, Response } from 'express';
import type { ErrorResponse } from '../types.js';

export const notFound = (
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};