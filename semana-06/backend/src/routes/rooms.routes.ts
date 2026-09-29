// File Path: ./semana-06/backend/src/routes/rooms.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/rooms.controller.js';

export const roomsRouter = Router();
roomsRouter.get('/', controller.getRooms);
roomsRouter.get('/:id', controller.getRoomById);
roomsRouter.post('/', controller.createRoom);
roomsRouter.put('/:id', controller.updateRoom);
roomsRouter.delete('/:id', controller.deleteRoom);