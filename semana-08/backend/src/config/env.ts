// File Path: ./semana-08/backend/src/config/env.ts  (fragmento a añadir)
  cors: {
    origins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  rateLimit: {
    globalMax: Number(process.env.RATE_LIMIT_GLOBAL_MAX ?? 100),
    authMax: Number(process.env.RATE_LIMIT_AUTH_MAX ?? 5),
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900_000),
  },