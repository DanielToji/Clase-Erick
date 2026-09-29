// File Path: ./semana-07/backend/src/repositories/users.repository.ts

import { UserModel } from '../models/user.model.js';

export const findByEmail = async (email: string) =>
  UserModel.findOne({ email: email.toLowerCase() }).lean();

export const findById = async (id: string) => UserModel.findById(id).lean();

export const create = async (data: {
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin';
}) => {
  const doc = await UserModel.create(data);
  return doc.toObject();
};