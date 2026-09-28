// File Path: ./semana-03/backend/src/routes/rooms.routes.ts

import { Router } from 'express';
import * as roomsController from '../controllers/rooms.controller.js';

export const roomsRouter = Router();

roomsRouter.get('/', roomsController.getRooms);
roomsRouter.get('/:id', roomsController.getRoomById);
roomsRouter.post('/', roomsController.createRoom);
roomsRouter.put('/:id', roomsController.updateRoom);
roomsRouter.delete('/:id', roomsController.deleteRoom);