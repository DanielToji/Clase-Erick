// File Path: ./semana-07/backend/src/utils/jwt.ts

import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AccessPayload {
  sub: string;
  role: 'user' | 'admin';
}

export interface RefreshPayload {
  sub: string;
  jti: string;
}

export const signAccessToken = (payload: AccessPayload): string =>
  jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  } as SignOptions);

export const signRefreshToken = (payload: RefreshPayload): string =>
  jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as SignOptions);

export const verifyAccessToken = (token: string): AccessPayload =>
  jwt.verify(token, env.jwt.accessSecret) as AccessPayload;

export const verifyRefreshToken = (token: string): RefreshPayload =>
  jwt.verify(token, env.jwt.refreshSecret) as RefreshPayload;