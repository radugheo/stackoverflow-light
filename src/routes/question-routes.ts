import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { answerRouter } from './answer-routes';
import { questionController, userService } from '../config/dependencies';

export const questionRouter = Router();

questionRouter.get('/', questionController.findAll);

questionRouter.get('/:id', questionController.findOne);

questionRouter.use('/:questionId/answers', answerRouter);

questionRouter.use(handleAuth(userService));

questionRouter.post('/', requireAuth, questionController.create);

questionRouter.put('/:id', requireAuth, questionController.update);

questionRouter.delete('/:id', requireAuth, questionController.delete);
