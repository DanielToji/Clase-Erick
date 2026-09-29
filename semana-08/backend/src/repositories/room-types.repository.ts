// File Path: ./semana-06/backend/src/repositories/room-types.repository.ts

import { RoomTypeModel } from '../models/room-type.model.js';

export const findAll = async () => RoomTypeModel.find().sort({ name: 1 }).lean();

export const findById = async (id: string) => RoomTypeModel.findById(id).lean();

export const findByName = async (name: string) =>
  RoomTypeModel.findOne({ name }).lean();

export const create = async (data: {
  name: string;
  description?: string;
  basePrice: number;
}) => {
  const doc = await RoomTypeModel.create(data);
  return doc.toObject();
};

export const update = async (
  id: string,
  data: Partial<{ name: string; description: string; basePrice: number }>,
) =>
  RoomTypeModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

export const remove = async (id: string) =>
  RoomTypeModel.findByIdAndDelete(id).lean();