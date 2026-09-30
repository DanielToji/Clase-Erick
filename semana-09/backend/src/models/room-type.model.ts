// File Path: ./semana-09/backend/src/models/room-type.model.ts

import { Schema, model, type InferSchemaType } from 'mongoose';

const roomTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    basePrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: 'roomtypes' },
);

export type RoomTypeDoc = InferSchemaType<typeof roomTypeSchema>;
export const RoomTypeModel = model('RoomType', roomTypeSchema);