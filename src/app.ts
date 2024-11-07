import express from 'express';
import * as dotenv from 'dotenv';
import { configureAuth } from './config/auth-config';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger-config';
import { v1Router } from './routes/v1/routes';

dotenv.config();

export const createApp = () => {
  const app = express();

  const swaggerDocs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use(express.json());
  app.use(configureAuth);

  app.get('/', (_, res) => {
    res.redirect('/api/v1/questions');
  });

  app.use('/api/v1', v1Router);
  return app;
};
