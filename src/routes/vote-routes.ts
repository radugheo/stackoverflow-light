import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { userService, voteController } from '../config/dependencies';
import { clearQuestionsCache } from '../middlewares/cache-middleware';

export const voteRouter = Router();

voteRouter.use(handleAuth(userService));

voteRouter.post('/', requireAuth, clearQuestionsCache, voteController.create);

voteRouter.delete('/:id', requireAuth, clearQuestionsCache, voteController.delete);

voteRouter.get('/user', requireAuth, voteController.getUserVote);
