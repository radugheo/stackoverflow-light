import { Router } from 'express';
import { handleAuth, requireAuth } from '../../middlewares/auth-middleware';
import { answerRouter } from './answer-routes';
import { questionController, userService } from '../../config/dependencies';
import { cachePopularQuestions, clearQuestionsCache } from '../../middlewares/cache-middleware';

export const questionRouter = Router();

questionRouter.get('/', cachePopularQuestions, questionController.findAll);

questionRouter.get('/:id', questionController.findOne);

questionRouter.use('/:questionId/answers', answerRouter);

questionRouter.use(handleAuth(userService));

questionRouter.post('/', requireAuth, clearQuestionsCache, questionController.create);

questionRouter.put('/:id', requireAuth, clearQuestionsCache, questionController.update);

questionRouter.delete('/:id', requireAuth, clearQuestionsCache, questionController.delete);
