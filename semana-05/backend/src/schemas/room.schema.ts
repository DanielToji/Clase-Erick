// File Path: ./semana-05/backend/src/schemas/room.schema.ts

import { z } from 'zod';

const uuidSchema = z.string().uuid('Invalid UUID');

/** Validación del parámetro `:id`. */
export const roomIdSchema = uuidSchema;

/** Cuerpo del POST /rooms. */
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1).max(10).trim(),
  price: z.coerce.number().positive().max(10_000),
  capacity: z.coerce.number().int().positive().max(20),
  floor: z.coerce.number().int().min(0).max(200),
  available: z.boolean().default(true),
  roomTypeId: uuidSchema,
});

/** Cuerpo del PUT /rooms/:id. */
export const updateRoomSchema = createRoomSchema.partial();

/** Cuerpo del POST /room-types (recurso secundario). */
export const createRoomTypeSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  description: z.string().max(200).trim().optional(),
  basePrice: z.coerce.number().positive().max(10_000),
});