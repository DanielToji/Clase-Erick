// File Path: ./semana-07/backend/src/services/rooms.service.ts

import * as repo from '../repositories/rooms.repository.js';
import type { RoomFilters } from '../repositories/rooms.repository.js';
import { AppError } from '../errors/AppError.js';
import { RoomTypeModel } from '../models/room-type.model.js';

export const getAll = async (filters: RoomFilters, page: number, limit: number) =>
  repo.findAll(filters, { page, limit });

export const getById = async (id: string) => {
  const room = await repo.findById(id);
  if (!room) throw new AppError(404, 'Not Found', `Room ${id} not found`);
  return room;
};

export const create = async (
  input: {
    roomNumber: string;
    price: number;
    capacity: number;
    floor: number;
    available: boolean;
    roomTypeId: string;
  },
  addedBy: string,
) => {
  const [existing, roomType] = await Promise.all([
    repo.findByRoomNumber(input.roomNumber),
    RoomTypeModel.exists({ _id: input.roomTypeId }),
  ]);
  if (existing) throw new AppError(409, 'Conflict', `Room number ${input.roomNumber} already exists`);
  if (!roomType) throw new AppError(400, 'Bad Request', `RoomType ${input.roomTypeId} does not exist`);
  return repo.create({ ...input, addedBy });
};

export const update = async (
  id: string,
  input: Partial<{
    roomNumber: string;
    price: number;
    capacity: number;
    floor: number;
    available: boolean;
    roomTypeId: string;
  }>,
) => {
  const updated = await repo.update(id, input);
  if (!updated) throw new AppError(404, 'Not Found', `Room ${id} not found`);
  return updated;
};

export const remove = async (id: string) => {
  const deleted = await repo.remove(id);
  if (!deleted) throw new AppError(404, 'Not Found', `Room ${id} not found`);
};