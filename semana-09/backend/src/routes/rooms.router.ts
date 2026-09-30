// File Path: ./semana-09/backend/src/routes/rooms.routes.ts

import { Router } from 'express';
import * as controller from '../controllers/rooms.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

export const roomsRouter = Router();

roomsRouter.get('/', controller.getRooms);
roomsRouter.get('/:id', controller.getRoomById);

roomsRouter.post('/', authMiddleware, requireRole('user', 'admin'), controller.createRoom);
roomsRouter.patch('/:id', authMiddleware, requireRole('user', 'admin'), controller.updateRoom);

roomsRouter.delete('/:id', authMiddleware, requireRole('admin'), controller.deleteRoom);