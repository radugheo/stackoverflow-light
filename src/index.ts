import express from 'express';
import { AppDataSource } from './config/database';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, '0.0.0.0', () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('Error during Data Source initialization:', error));
