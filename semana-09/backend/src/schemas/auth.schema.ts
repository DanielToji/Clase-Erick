// File Path: ./semana-09/backend/src/schemas/auth.schema.ts

import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 chars')
    .max(72, 'Password too long (bcrypt limit)'),
});

export const loginSchema = registerSchema;