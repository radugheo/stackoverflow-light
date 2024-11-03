import { Router } from 'express';
import { handleAuth, requireAuth } from '../middlewares/auth-middleware';
import { userService, voteController } from '../config/dependencies';

export const voteRouter = Router();

voteRouter.use(handleAuth(userService));

voteRouter.post('/', requireAuth, voteController.create);

voteRouter.delete('/:id', requireAuth, voteController.delete);

voteRouter.get('/user', requireAuth, voteController.getUserVote);
