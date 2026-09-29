// File Path: ./semana-06/backend/src/schemas/room.schema.ts

import { z } from 'zod';
import { objectIdSchema } from './room-type.schema.js';

/** Validación del parámetro `:id`. */
export const roomIdSchema = objectIdSchema;

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1).max(10).trim(),
  price: z.coerce.number().positive().max(10_000),
  capacity: z.coerce.number().int().positive().max(20),
  floor: z.coerce.number().int().min(0).max(200),
  available: z.boolean().default(true),
  roomTypeId: objectIdSchema,
});

export const updateRoomSchema = createRoomSchema.partial();