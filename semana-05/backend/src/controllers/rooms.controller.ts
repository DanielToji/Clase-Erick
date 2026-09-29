// File Path: ./semana-03/backend/src/controllers/rooms.controller.ts

import type { NextFunction, Request, Response } from 'express';
import * as roomsService from '../services/rooms.service.js';
import { HttpError } from '../errors/HttpError.js';
import type { CreateRoomInput, UpdateRoomInput } from '../types.js';

/** Normaliza query params de paginación a valores seguros. */
const parsePagination = (
  query: Request['query'],
): { page: number; limit: number } => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0 && rawLimit <= 100
      ? rawLimit
      : 10;
  return { page, limit };
};

/** Convierte `:id` a entero positivo o lanza HttpError(400). */
const parseId = (raw: string | string[]): number => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Bad Request', `Invalid room id: ${value}`);
  }
  return id;
};

/** GET /api/v1/rooms?page&limit */
export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit } = parsePagination(req.query);
    const result = await roomsService.getAll(page, limit);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/** GET /api/v1/rooms/:id */
export const getRoomById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    const room = await roomsService.getById(id);
    res.status(200).json({ data: room });
  } catch (err) {
    next(err);
  }
};

/** POST /api/v1/rooms */
export const createRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const payload = req.body as CreateRoomInput;
    const room = await roomsService.create(payload);
    res.status(201).json({ data: room });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/v1/rooms/:id */
export const updateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    const payload = req.body as UpdateRoomInput;
    const room = await roomsService.update(id, payload);
    res.status(200).json({ data: room });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/v1/rooms/:id */
export const deleteRoom = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    await roomsService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};