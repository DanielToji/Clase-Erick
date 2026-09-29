// File Path: ./semana-07/backend/src/routes/room-types.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/room-types.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const roomTypesRouter = Router();
roomTypesRouter.use(authMiddleware);
roomTypesRouter.get('/', controller.getRoomTypes);
roomTypesRouter.get('/:id', controller.getRoomTypeById);
roomTypesRouter.post('/', controller.createRoomType);
roomTypesRouter.put('/:id', controller.updateRoomType);
roomTypesRouter.delete('/:id', controller.deleteRoomType);