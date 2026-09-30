// File Path: ./semana-09/backend/src/routes/auth.routes.ts

import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', controller.logout);
authRouter.get('/me', authMiddleware, controller.me);