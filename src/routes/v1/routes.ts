import { Router } from 'express';
import { userRouter } from './user-routes';
import { questionRouter } from './question-routes';
import { voteRouter } from './vote-routes';
import { metricsRouter } from './metrics-routes';
import { testRouter } from './test-routes';

export const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/questions', questionRouter);
v1Router.use('/votes', voteRouter);
v1Router.use('/metrics', metricsRouter);

// Development route for testing Redis cache
v1Router.use('/dev', testRouter);
