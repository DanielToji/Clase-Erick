// File Path: ./semana-08/backend/src/config/security.ts

import helmet from 'helmet';
import cors, { type CorsOptions } from 'cors';
import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';
import { env } from './env.js';

/** Helmet con defaults endurecidos + CSP deshabilitada (API pura JSON). */
export const helmetMiddleware: RequestHandler = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/** CORS con whitelist explícita. Nunca `*` en producción. */
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.cors.origins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
};

export const corsMiddleware: RequestHandler = cors(corsOptions);

/** Rate limiter global para todas las rutas. */
export const globalLimiter: RequestHandler = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.globalMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too Many Requests', message: 'Rate limit exceeded' },
});

/** Rate limiter estricto para /auth/login y /auth/register. */
export const authLimiter: RequestHandler = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.authMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: 'Too many auth attempts, try again later',
  },
});