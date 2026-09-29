// File Path: ./semana-07/backend/src/controllers/auth.controller.ts

import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { registerSchema } from '../schemas/auth.schema.js';
import { AppError } from '../errors/AppError.js';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...authService.cookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...authService.cookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });
};

const clearAuthCookies = (res: Response): void => {
  res.clearCookie(ACCESS_COOKIE, authService.cookieOptions);
  res.clearCookie(REFRESH_COOKIE, authService.cookieOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    const result = await authService.register(parsed.data);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json({ data: { user: result.user } });
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    const result = await authService.login(parsed.data);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({ data: { user: result.user } });
  } catch (err) { next(err); }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    if (!raw) throw new AppError(401, 'Unauthorized', 'Refresh token is required');
    const result = await authService.refresh(raw);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    res.status(200).json({ data: { refreshed: true } });
  } catch (err) { next(err); }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const raw = req.cookies?.[REFRESH_COOKIE] as string | undefined;
    await authService.logout(raw);
    clearAuthCookies(res);
    res.status(204).send();
  } catch (err) { next(err); }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError(401, 'Unauthorized', 'Not authenticated');
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ data: user });
  } catch (err) { next(err); }
};