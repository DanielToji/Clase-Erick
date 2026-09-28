// File Path: ./semana-03/backend/src/server.ts

import { app } from './src/app.js';

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  process.stdout.write(`Server listening on http://localhost:${PORT}\n`);
});