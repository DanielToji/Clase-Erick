// File Path: ./semana-07/backend/src/models/room.model.ts

import { Schema, model, Types, type InferSchemaType } from 'mongoose';

const roomSchema = new Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    floor: { type: Number, required: true, min: 0 },
    available: { type: Boolean, default: true },
    roomTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'RoomType',
      required: true,
      index: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true, collection: 'rooms' },
);

export type RoomDoc = InferSchemaType<typeof roomSchema> & {
  roomTypeId: Types.ObjectId;
  addedBy: Types.ObjectId;
};
export const RoomModel = model('Room', roomSchema);