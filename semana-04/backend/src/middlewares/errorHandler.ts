// File Path: ./semana-04/backend/src/middlewares/errorHandler.ts

import { ZodError } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';
import type { ErrorResponse } from '../types.js';

/** Forma de las respuestas de error que puede incluir `issues` (Zod). */
interface ErrorPayload extends ErrorResponse {
  issues?: unknown;
}

/**
 * Error handler central. Debe declarar EXACTAMENTE 4 parámetros para que
 * Express 5 lo reconozca como handler de errores y no como middleware normal.
 * Orden de discriminación: ZodError → AppError → genérico.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response<ErrorPayload>,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request payload',
      issues: err.issues,
    });
    return;
  }

  if (err instanceof AppError) {
    if (err.isOperational) {
      logger.warn(`${err.name} ${err.statusCode}: ${err.message}`);
    } else {
      logger.error(`Non-operational error: ${err.message}`);
    }
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  logger.error(
    `Unhandled error: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
  );
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Unexpected error',
  });
};