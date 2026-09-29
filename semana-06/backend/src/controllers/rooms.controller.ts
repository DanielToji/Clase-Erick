// File Path: ./semana-06/backend/src/controllers/rooms.controller.ts

import type { NextFunction, Request, Response } from 'express';
import * as service from '../services/rooms.service.js';
import { AppError } from '../errors/AppError.js';
import { createRoomSchema, roomIdSchema, updateRoomSchema } from '../schemas/room.schema.js';

const parsePagination = (query: Request['query']): { page: number; limit: number } => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isInteger(rawLimit) && rawLimit > 0 && rawLimit <= 100 ? rawLimit : 10;
  return { page, limit };
};

const parseId = (raw: string): string => {
  const result = roomIdSchema.safeParse(raw);
  if (!result.success) throw new AppError(400, 'Bad Request', `Invalid room id: ${raw}`);
  return result.data;
};

export const getRooms = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit } = parsePagination(req.query);
    const filters: { available?: boolean; roomTypeId?: string } = {};
    if (req.query.available !== undefined) filters.available = req.query.available === 'true';
    if (typeof req.query.roomTypeId === 'string') filters.roomTypeId = req.query.roomTypeId;
    res.status(200).json(await service.getAll(filters, page, limit));
  } catch (err) { next(err); }
};

export const getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ data: await service.getById(parseId(req.params.id)) });
  } catch (err) { next(err); }
};

export const createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    res.status(201).json({ data: await service.create(parsed.data) });
  } catch (err) { next(err); }
};

export const updateRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    const parsed = updateRoomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    res.status(200).json({ data: await service.update(id, parsed.data) });
  } catch (err) { next(err); }
};

export const deleteRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await service.remove(parseId(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};