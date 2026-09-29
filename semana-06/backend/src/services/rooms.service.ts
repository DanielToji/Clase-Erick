// File Path: ./semana-06/backend/src/services/rooms.service.ts

import * as repo from '../repositories/rooms.repository.js';
import type { RoomFilters } from '../repositories/rooms.repository.js';
import { AppError } from '../errors/AppError.js';
import { RoomTypeModel } from '../models/room-type.model.js';

/** Listado paginado con filtros opcionales. */
export const getAll = async (filters: RoomFilters, page: number, limit: number) =>
  repo.findAll(filters, { page, limit });

/** Detalle o 404. */
export const getById = async (id: string) => {
  const room = await repo.findById(id);
  if (!room) throw new AppError(404, 'Not Found', `Room ${id} not found`);
  return room;
};

/** Crea validando unicidad de roomNumber y existencia de roomTypeId. */
export const create = async (input: {
  roomNumber: string;
  price: number;
  capacity: number;
  floor: number;
  available: boolean;
  roomTypeId: string;
}) => {
  const [existing, roomType] = await Promise.all([
    repo.findByRoomNumber(input.roomNumber),
    RoomTypeModel.exists({ _id: input.roomTypeId }),
  ]);
  if (existing) {
    throw new AppError(409, 'Conflict', `Room number ${input.roomNumber} already exists`);
  }
  if (!roomType) {
    throw new AppError(400, 'Bad Request', `RoomType ${input.roomTypeId} does not exist`);
  }
  return repo.create(input);
};

/** Actualización parcial o 404. */
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

/** Eliminación o 404. */
export const remove = async (id: string) => {
  const deleted = await repo.remove(id);
  if (!deleted) throw new AppError(404, 'Not Found', `Room ${id} not found`);
};