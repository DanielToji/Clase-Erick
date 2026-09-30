// File Path: ./semana-09/backend/src/routes/user.routes.ts

import { Router, type Request, type Response, type NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';
import { UserModel } from '../models/user.model.js';

export const userRouter = Router();

userRouter.get(
  '/',
  authMiddleware,
  requireRole('admin'),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await UserModel.find().select('-passwordHash').lean();
      res.status(200).json({ data: users });
    } catch (err) {
      next(err);
    }
  },
);