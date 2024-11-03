import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { userService, voteController } from '../config/dependencies';

export const voteRouter = Router();

voteRouter.use(handleAuth(userService));

/**
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Create or update vote
 *     tags: [Votes]
 *     security:
 *       - openid: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: number
 *                 enum: [1, -1]
 *               questionId:
 *                 type: string
 *               answerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vote created/updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
voteRouter.post('/', requireAuth, voteController.create);

/**
 * @swagger
 * /api/votes/{id}:
 *   delete:
 *     summary: Delete vote
 *     tags: [Votes]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
voteRouter.delete('/:id', requireAuth, voteController.delete);

/**
 * @swagger
 * /api/votes/user:
 *   get:
 *     summary: Get user's vote for question/answer
 *     tags: [Votes]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: query
 *         name: questionId
 *         schema:
 *           type: string
 *       - in: query
 *         name: answerId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User's vote
 *       401:
 *         description: Unauthorized
 */
voteRouter.get('/user', requireAuth, voteController.getUserVote);
