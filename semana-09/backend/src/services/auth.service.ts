// File Path: ./semana-09/backend/src/services/auth.service.ts

import crypto from 'node:crypto';
import * as usersRepo from '../repositories/users.repository.js';
import * as tokensRepo from '../repositories/refresh-tokens.repository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const buildTokenPair = async (
  userId: string,
  role: 'user' | 'admin',
): Promise<{ accessToken: string; refreshToken: string }> => {
  const jti = crypto.randomUUID();
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId, jti });

  await tokensRepo.create({
    tokenHash: tokensRepo.hashToken(refreshToken),
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });

  return { accessToken, refreshToken };
};

export const register = async (input: { email: string; password: string }) => {
  const existing = await usersRepo.findByEmail(input.email);
  if (existing) throw new AppError(409, 'Conflict', 'Email already registered');

  const passwordHash = await hashPassword(input.password);
  const user = await usersRepo.create({
    email: input.email,
    passwordHash,
    role: 'user',
  });
  const tokens = await buildTokenPair(user._id.toString(), user.role);
  return { user: { id: user._id.toString(), email: user.email, role: user.role }, ...tokens };
};

export const login = async (input: { email: string; password: string }) => {
  const user = await usersRepo.findByEmail(input.email);
  if (!user) throw new AppError(401, 'Unauthorized', 'Invalid credentials');

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) throw new AppError(401, 'Unauthorized', 'Invalid credentials');

  const tokens = await buildTokenPair(user._id.toString(), user.role);
  return { user: { id: user._id.toString(), email: user.email, role: user.role }, ...tokens };
};

export const refresh = async (rawRefreshToken: string) => {
  const payload = verifyRefreshToken(rawRefreshToken);
  const tokenHash = tokensRepo.hashToken(rawRefreshToken);
  const stored = await tokensRepo.findByHash(tokenHash);

  if (!stored) throw new AppError(401, 'Unauthorized', 'Refresh token revoked');

  await tokensRepo.deleteByHash(tokenHash);
  const user = await usersRepo.findById(payload.sub);
  if (!user) throw new AppError(401, 'Unauthorized', 'User not found');

  return buildTokenPair(user._id.toString(), user.role);
};

export const logout = async (rawRefreshToken: string | undefined): Promise<void> => {
  if (!rawRefreshToken) return;
  const tokenHash = tokensRepo.hashToken(rawRefreshToken);
  await tokensRepo.deleteByHash(tokenHash);
};

export const getMe = async (userId: string) => {
  const user = await usersRepo.findById(userId);
  if (!user) throw new AppError(404, 'Not Found', 'User not found');
  return { id: user._id.toString(), email: user.email, role: user.role };
};

export const cookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  path: '/',
} as const;