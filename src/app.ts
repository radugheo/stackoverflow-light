import express from 'express';
import * as dotenv from 'dotenv';
import { configureAuth } from './middlewares/auth-middleware';
import { userRouter } from './routes/user-routes';

dotenv.config();

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(configureAuth);

  app.get('/health', (_, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/users', userRouter);

  return app;
};