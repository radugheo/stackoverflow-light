import express from 'express';
import * as dotenv from 'dotenv';
import { userRouter } from './routes/user-routes';
import { configureAuth } from './config/auth-config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger-config';
import { questionRouter } from './routes/question-routes';
import { voteRouter } from './routes/vote-routes';
import { metricsRouter } from './routes/metrics-routes';

dotenv.config();

export const createApp = () => {
  const app = express();

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use(express.json());
  app.use(configureAuth);

  app.get('/', (_, res) => {
    res.redirect('/api/questions');
  });

  app.use('/api/users', userRouter);
  app.use('/api/questions', questionRouter);
  app.use('/api/votes', voteRouter);
  app.use('/api/metrics', metricsRouter);

  // Development route for testing Redis cache
  // app.use('/api/dev', testRouter);
  return app;
};
