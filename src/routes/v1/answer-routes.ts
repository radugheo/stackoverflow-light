import { Router } from 'express';
import { handleAuth, requireAuth } from '../../middlewares/auth-middleware';
import { answerController, userService } from '../../config/dependencies';

export const answerRouter = Router({ mergeParams: true });

answerRouter.get('/', answerController.findAll);

answerRouter.use(handleAuth(userService));

answerRouter.post('/', requireAuth, answerController.create);

answerRouter.put('/:id', requireAuth, answerController.update);

answerRouter.delete('/:id', requireAuth, answerController.delete);
