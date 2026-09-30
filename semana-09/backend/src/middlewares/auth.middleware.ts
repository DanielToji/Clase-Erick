// File Path: ./semana-09/backend/src/middlewares/auth.middleware.ts

import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../errors/AppError.js';

const ACCESS_COOKIE = 'access_token';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;
  if (!token) {
    next(new AppError(401, 'Unauthorized', 'Access token is required'));
    return;
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, 'Unauthorized', 'Invalid or expired access token'));
  }
};