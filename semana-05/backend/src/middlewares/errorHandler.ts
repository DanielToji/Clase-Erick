// File Path: ./semana-05/backend/src/middlewares/errorHandler.ts

import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';
import type { ErrorResponse } from '../types.js';

interface ErrorPayload extends ErrorResponse {
  issues?: unknown;
}

/**
 * Handler central. Orden: ZodError → Prisma known errors → AppError → genérico.
 * Convierte P2025 → 404 y P2002 → 409 para no filtrar detalles de Prisma al cliente.
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      logger.warn(`Prisma P2025: ${err.message}`);
      res.status(404).json({ error: 'Not Found', message: 'Resource not found' });
      return;
    }
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.join(', ') ?? 'field';
      logger.warn(`Prisma P2002 on ${target}`);
      res.status(409).json({
        error: 'Conflict',
        message: `Duplicate value for unique field: ${target}`,
      });
      return;
    }
    logger.error(`Prisma ${err.code}: ${err.message}`);
    res.status(500).json({ error: 'Database Error', message: 'Unhandled database error' });
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