// File Path: ./semana-04/backend/src/controllers/rooms.controller.ts

import type { NextFunction, Request, Response } from 'express';
import * as roomsService from '../services/rooms.service.js';
import { AppError } from '../errors/HttpError.js';
import {
  createRoomSchema,
  roomIdSchema,
  updateRoomSchema,
} from '../schemas/room.schema.js';

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

/** Valida `:id` con Zod y lanza AppError(400) si falla. */
const parseId = (raw: string): number => {
  const result = roomIdSchema.safeParse(raw);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', `Invalid room id: ${raw}`);
  }
  return result.data;
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
    const id = parseId(req.params.id as string);
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
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request payload',
        issues: parsed.error.issues,
      });
      return;
    }
    const room = await roomsService.create(parsed.data);
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
    const id = parseId(req.params.id as string);
    const parsed = updateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid request payload',
        issues: parsed.error.issues,
      });
      return;
    }
    const room = await roomsService.update(id, parsed.data);
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
    const id = parseId(req.params.id as string);
    await roomsService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};