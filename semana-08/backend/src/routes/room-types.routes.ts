// File Path: ./semana-08/backend/src/routes/rooms.routes.ts

import { Router } from 'express';
import * as controller from '../controllers/rooms.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

export const roomsRouter = Router();

// Público: explorar habitaciones
roomsRouter.get('/', controller.getRooms);
roomsRouter.get('/:id', controller.getRoomById);

// Autenticado: crear y editar
roomsRouter.post('/', authMiddleware, requireRole('user', 'admin'), controller.createRoom);
roomsRouter.patch('/:id', authMiddleware, requireRole('user', 'admin'), controller.updateRoom);

// Solo admin: eliminar
roomsRouter.delete('/:id', authMiddleware, requireRole('admin'), controller.deleteRoom);