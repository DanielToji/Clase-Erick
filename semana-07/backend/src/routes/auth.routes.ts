// File Path: ./semana-07/backend/src/routes/rooms.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/rooms.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const roomsRouter = Router();
roomsRouter.use(authMiddleware);
roomsRouter.get('/', controller.getRooms);
roomsRouter.get('/:id', controller.getRoomById);
roomsRouter.post('/', controller.createRoom);
roomsRouter.put('/:id', controller.updateRoom);
roomsRouter.delete('/:id', controller.deleteRoom);