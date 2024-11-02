import express from 'express';
import * as dotenv from 'dotenv';
import { userRouter } from './routes/user-routes';
import { configureAuth } from './config/auth-config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger-config';
import { questionRouter } from './routes/question-routes';

dotenv.config();

export const createApp = () => {
  const app = express();

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use(express.json());
  app.use(configureAuth);

  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRouter);
  app.use('/api/questions', questionRouter);
  return app;
};
