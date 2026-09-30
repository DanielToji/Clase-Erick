// File Path: ./semana-09/backend/src/models/user.model.ts

import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true, collection: 'users' },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = model('User', userSchema);