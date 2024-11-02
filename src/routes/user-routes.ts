import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { UserService } from '../services/user-service';
import { requireAuth, handleAuth } from '../middlewares/auth-middleware';

const userService = new UserService();
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.use(handleAuth(userService));

userRouter.get('/profile', requireAuth, userController.getProfile);
