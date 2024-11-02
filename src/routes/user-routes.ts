import { Router } from 'express';
import { UserController } from '../controllers/user-controller';
import { UserService } from '../services/user-service';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';

const userService = new UserService();
const userController = new UserController(userService);

export const userRouter = Router();

userRouter.use(handleAuth(userService));

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - openid: [] 
 *     responses:
 *       200:
 *         description: User profile information
 *       401:
 *         description: Unauthorized
 */
userRouter.get('/profile', requireAuth, userController.getProfile);
