// File Path: ./semana-07/backend/src/models/refresh-token.model.ts

import { Schema, model, Types, type InferSchemaType } from 'mongoose';

const refreshTokenSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true, collection: 'refreshtokens' },
);

// TTL: Mongo borra automáticamente los tokens expirados.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type RefreshTokenDoc = InferSchemaType<typeof refreshTokenSchema> & {
  userId: Types.ObjectId;
};
export const RefreshTokenModel = model('RefreshToken', refreshTokenSchema);