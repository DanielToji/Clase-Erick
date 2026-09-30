// File Path: ./semana-09/backend/src/schemas/room-type.schema.ts

import { z } from 'zod';

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createRoomTypeSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  description: z.string().max(200).trim().optional(),
  basePrice: z.coerce.number().positive().max(10_000),
});

export const updateRoomTypeSchema = createRoomTypeSchema.partial();