// File Path: ./semana-09/backend/src/middlewares/sanitize.ts

import type { NextFunction, Request, Response } from 'express';

const FORBIDDEN_KEYS = /^\$|\./;

const scrub = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.test(key)) continue;
      clean[key] = scrub(val);
    }
    return clean;
  }
  return value;
};

export const sanitizeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.body) req.body = scrub(req.body);
  if (req.params) req.params = scrub(req.params) as Request['params'];
  next();
};