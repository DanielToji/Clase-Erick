// File Path: ./semana-09/backend/src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'user' | 'admin';
      };
    }
  }
}

export {};