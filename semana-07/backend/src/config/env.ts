// File Path: ./semana-07/backend/src/config/env.ts

/**
 * Valida secrets obligatorios. Falla rápido si faltan o son débiles.
 * Se importa antes que cualquier módulo que use JWT.
 */
const requireSecret = (name: string): string => {
  const value = process.env[name];
  if (!value || value.startsWith('CHANGE_ME') || value.length < 32) {
    throw new Error(`${name} must be set to a secret of at least 32 chars`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3002),
  mongoUri: process.env.MONGO_URI ?? '',
  jwt: {
    accessSecret: requireSecret('JWT_ACCESS_SECRET'),
    refreshSecret: requireSecret('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: (process.env.COOKIE_SAME_SITE ?? 'lax') as 'lax' | 'strict' | 'none',
  },
} as const;