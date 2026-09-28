// File Path: ./semana-04/backend/src/server.ts

import { app } from './app.js';
import { logger } from './config/logger.js';

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  logger.info(`Server listening on http://localhost:${PORT}`);
});