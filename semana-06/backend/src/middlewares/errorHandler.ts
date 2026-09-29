// File Path: ./semana-06/backend/src/middlewares/errorHandler.ts

import { ZodError } from 'zod';
import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';
import type { ErrorResponse } from '../types.js';

interface ErrorPayload extends ErrorResponse {
  issues?: unknown;
}

/**
 * Handler central. Orden de discriminación:
 * ZodError → Mongoose CastError → Mongoose ValidationError → MongoServerError 11000
 * → AppError → genérico.
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

  if (err instanceof mongoose.Error.CastError) {
    logger.warn(`CastError on ${err.path}: ${err.value}`);
    res.status(400).json({
      error: 'Bad Request',
      message: `Invalid value for field '${err.path}'`,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const issues = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    res.status(400).json({
      error: 'Validation Error',
      message: 'Schema validation failed',
      issues,
    });
    return;
  }

  if (
    err instanceof Error &&
    'code' in err &&
    (err as { code?: number }).code === 11000
  ) {
    const keyValue = (err as { keyValue?: Record<string, unknown> }).keyValue ?? {};
    const fields = Object.keys(keyValue).join(', ');
    logger.warn(`Duplicate key on ${fields}`);
    res.status(409).json({
      error: 'Conflict',
      message: `Duplicate value for unique field: ${fields}`,
    });
    return;
  }

  if (err instanceof AppError) {
    if (err.isOperational) logger.warn(`${err.name} ${err.statusCode}: ${err.message}`);
    else logger.error(`Non-operational: ${err.message}`);
    res.status(err.statusCode).json({ error: err.name, message: err.message });
    return;
  }

  logger.error(
    `Unhandled: ${err instanceof Error ? err.stack ?? err.message : String(err)}`,
  );
  res.status(500).json({ error: 'Internal Server Error', message: 'Unexpected error' });
};