// File Path: ./semana-03/backend/src/services/rooms.service.ts

import * as roomsRepository from '../repositories/rooms.repository.js';
import { HttpError } from '../errors/HttpError.js';
import type {
  CreateRoomInput,
  PaginatedResponse,
  Room,
  UpdateRoomInput,
} from '../types.js';

/** Listado paginado de habitaciones. */
export const getAll = async (
  page: number,
  limit: number,
): Promise<PaginatedResponse<Room>> => {
  const all = await roomsRepository.findAll();
  const total = all.length;
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);

  return { data, total, page, limit };
};

/** Obtiene una habitación o lanza HttpError(404). */
export const getById = async (id: number): Promise<Room> => {
  const room = await roomsRepository.findById(id);
  if (!room) {
    throw new HttpError(404, 'Not Found', `Room ${id} not found`);
  }
  return room;
};

/** Crea una habitación validando unicidad de `roomNumber`. */
export const create = async (input: CreateRoomInput): Promise<Room> => {
  const existing = await roomsRepository.findByRoomNumber(input.roomNumber);
  if (existing) {
    throw new HttpError(
      409,
      'Conflict',
      `Room number ${input.roomNumber} already exists`,
    );
  }
  return roomsRepository.create(input);
};

/** Actualiza una habitación o lanza HttpError(404). */
export const update = async (
  id: number,
  input: UpdateRoomInput,
): Promise<Room> => {
  const updated = await roomsRepository.update(id, input);
  if (!updated) {
    throw new HttpError(404, 'Not Found', `Room ${id} not found`);
  }
  return updated;
};

/** Elimina una habitación o lanza HttpError(404). */
export const remove = async (id: number): Promise<void> => {
  const deleted = await roomsRepository.remove(id);
  if (!deleted) {
    throw new HttpError(404, 'Not Found', `Room ${id} not found`);
  }
};