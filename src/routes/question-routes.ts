import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { answerRouter } from './answer-routes';
import { questionController, userService } from '../config/dependencies';

export const questionRouter = Router();

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [newest, popular]
 *           default: newest
 *     responses:
 *       200:
 *         description: List of questions with pagination
 *       500:
 *         description: Server error
 */
questionRouter.get('/', questionController.findAll);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question details
 *       404:
 *         description: Question not found
 */
questionRouter.get('/:id', questionController.findOne);

questionRouter.use('/:questionId/answers', answerRouter);

questionRouter.use(handleAuth(userService));

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create new question
 *     tags: [Questions]
 *     security:
 *       - openid: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question created
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
questionRouter.post('/', requireAuth, questionController.create);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update question
 *     tags: [Questions]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Question updated
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
questionRouter.put('/:id', requireAuth, questionController.update);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete question
 *     tags: [Questions]
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
 *         description: Question deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
questionRouter.delete('/:id', requireAuth, questionController.delete);
