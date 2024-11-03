import { Router } from 'express';
import { AnswerController } from '../controllers/answer-controller';
import { AnswerService } from '../services/answer-service';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { UserService } from '../services/user-service';

const answerService = new AnswerService();
const answerController = new AnswerController(answerService);
const userService = new UserService();

export const answerRouter = Router({ mergeParams: true });

/**
 * @swagger
 * /api/questions/{questionId}/answers:
 *   get:
 *     summary: Get all answers for a question
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of answers
 *       404:
 *         description: Question not found
 */
answerRouter.get('/', answerController.findAll);

answerRouter.use(handleAuth(userService));

/**
 * @swagger
 * /api/questions/{questionId}/answers:
 *   post:
 *     summary: Create an answer
 *     tags: [Answers]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer created
 *       401:
 *         description: Authentication required
 */
answerRouter.post('/', requireAuth, answerController.create);

/**
 * @swagger
 * /api/questions/{questionId}/answers/{id}:
 *   put:
 *     summary: Update an answer
 *     tags: [Answers]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer updated
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
answerRouter.put('/:id', requireAuth, answerController.update);

/**
 * @swagger
 * /api/questions/{questionId}/answers/{id}:
 *   delete:
 *     summary: Delete an answer
 *     tags: [Answers]
 *     security:
 *       - openid: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Answer deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Not authorized
 */
answerRouter.delete('/:id', requireAuth, answerController.delete);
