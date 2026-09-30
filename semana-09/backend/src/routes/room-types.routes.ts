// File Path: ./semana-09/backend/src/routes/room-types.routes.ts

import { Router } from 'express';
import * as controller from '../controllers/room-types.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

export const roomTypesRouter = Router();

roomTypesRouter.get('/', controller.getRoomTypes);
roomTypesRouter.get('/:id', controller.getRoomTypeById);

roomTypesRouter.post('/', authMiddleware, requireRole('admin'), controller.createRoomType);
roomTypesRouter.put('/:id', authMiddleware, requireRole('admin'), controller.updateRoomType);
roomTypesRouter.delete('/:id', authMiddleware, requireRole('admin'), controller.deleteRoomType);