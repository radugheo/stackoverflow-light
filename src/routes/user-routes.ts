import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { userService, userController } from '../config/dependencies';

export const userRouter = Router();

userRouter.use(handleAuth(userService));

userRouter.get('/profile', requireAuth, userController.getProfile);
