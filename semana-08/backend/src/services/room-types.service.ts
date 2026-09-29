// File Path: ./semana-06/backend/src/services/room-types.service.ts

import * as repo from '../repositories/room-types.repository.js';
import { AppError } from '../errors/AppError.js';

export const getAll = async () => repo.findAll();

export const getById = async (id: string) => {
  const doc = await repo.findById(id);
  if (!doc) throw new AppError(404, 'Not Found', `RoomType ${id} not found`);
  return doc;
};

export const create = async (input: {
  name: string;
  description?: string;
  basePrice: number;
}) => {
  const existing = await repo.findByName(input.name);
  if (existing) {
    throw new AppError(409, 'Conflict', `RoomType '${input.name}' already exists`);
  }
  return repo.create(input);
};

export const update = async (
  id: string,
  input: Partial<{ name: string; description: string; basePrice: number }>,
) => {
  const updated = await repo.update(id, input);
  if (!updated) throw new AppError(404, 'Not Found', `RoomType ${id} not found`);
  return updated;
};

export const remove = async (id: string) => {
  const deleted = await repo.remove(id);
  if (!deleted) throw new AppError(404, 'Not Found', `RoomType ${id} not found`);
};