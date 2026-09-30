// File Path: ./semana-09/backend/src/repositories/refresh-tokens.repository.ts

import crypto from 'node:crypto';
import { RefreshTokenModel } from '../models/refresh-token.model.js';

export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');

export const create = async (data: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}) => RefreshTokenModel.create(data);

export const findByHash = async (tokenHash: string) =>
  RefreshTokenModel.findOne({ tokenHash }).lean();

export const deleteByHash = async (tokenHash: string) =>
  RefreshTokenModel.deleteOne({ tokenHash });

export const deleteByUserId = async (userId: string) =>
  RefreshTokenModel.deleteMany({ userId });