// File Path: ./semana-08/backend/src/middlewares/requireRole.ts

import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';

type Role = 'user' | 'admin';

/**
 * RBAC. Debe ejecutarse DESPUÉS de authMiddleware.
 * Si el usuario no tiene uno de los roles permitidos, responde 403.
 */
export const requireRole = (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'Unauthorized', 'Not authenticated'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(
        new AppError(
          403,
          'Forbidden',
          `Role '${req.user.role}' cannot perform this action`,
        ),
      );
      return;
    }
    next();
  };