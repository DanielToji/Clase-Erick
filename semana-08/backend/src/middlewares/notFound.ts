// File Path: ./semana-04/backend/src/middlewares/notFound.ts

import type { NextFunction, Request, Response } from 'express';
import type { ErrorResponse } from '../types.js';

/**
 * Middleware 404. Se registra DESPUÉS de todas las rutas y ANTES de errorHandler
 * para que cualquier URL desconocida devuelva JSON (no el HTML por defecto).
 */
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