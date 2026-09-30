// File Path: ./semana-09/backend/src/controllers/room-types.controller.ts

import type { NextFunction, Request, Response } from 'express';
import * as service from '../services/room-types.service.js';
import { AppError } from '../errors/AppError.js';
import {
  createRoomTypeSchema,
  objectIdSchema,
  updateRoomTypeSchema,
} from '../schemas/room-type.schema.js';

const parseId = (raw: string): string => {
  const result = objectIdSchema.safeParse(raw);
  if (!result.success) throw new AppError(400, 'Bad Request', `Invalid id: ${raw}`);
  return result.data;
};

export const getRoomTypes = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ data: await service.getAll() });
  } catch (err) { next(err); }
};

export const getRoomTypeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({ data: await service.getById(parseId(req.params.id)) });
  } catch (err) { next(err); }
};

export const createRoomType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createRoomTypeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    res.status(201).json({ data: await service.create(parsed.data) });
  } catch (err) { next(err); }
};

export const updateRoomType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseId(req.params.id);
    const parsed = updateRoomTypeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid payload', issues: parsed.error.issues });
      return;
    }
    res.status(200).json({ data: await service.update(id, parsed.data) });
  } catch (err) { next(err); }
};

export const deleteRoomType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await service.remove(parseId(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};