// File Path: ./semana-05/backend/src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

/**
 * Singleton de PrismaClient. Evita múltiples conexiones
 * durante hot-reload y en escenarios de tests (semana 09).
 */
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
});