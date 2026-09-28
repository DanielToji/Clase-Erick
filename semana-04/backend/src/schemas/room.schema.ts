// File Path: ./semana-04/backend/src/schemas/room.schema.ts

import { z } from 'zod';

export const roomTypeSchema = z.enum([
  'single',
  'double',
  'suite',
  'presidential',
]);

/** Validación del parámetro `:id` en rutas. */
export const roomIdSchema = z.coerce.number().int().positive();

/** Cuerpo del POST /rooms. */
export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'roomNumber is required')
    .max(10, 'roomNumber too long')
    .trim(),
  type: roomTypeSchema,
  price: z
    .number()
    .positive('price must be greater than 0')
    .max(10_000, 'price too high'),
  available: z.boolean().default(true),
});

/** Cuerpo del PUT /rooms/:id — todos los campos opcionales. */
export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;