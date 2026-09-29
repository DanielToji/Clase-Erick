// File Path: ./semana-06/backend/src/server.ts

import { app } from './app.js';
import { connectDB, disconnectDB } from './lib/mongoose.js';
import { logger } from './config/logger.js';

const PORT = Number(process.env.PORT ?? 3001);

const bootstrap = async (): Promise<void> => {
  await connectDB();
  const server = app.listen(PORT, () => {
    logger.info(`Server listening on http://localhost:${PORT}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.warn(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
};

bootstrap().catch((err) => {
  logger.error(`Bootstrap failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});