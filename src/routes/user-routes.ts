import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { userService, userController } from '../config/dependencies';

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
