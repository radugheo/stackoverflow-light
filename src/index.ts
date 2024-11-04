import { AppDataSource } from './config/database-config';
import { createApp } from './app';
import { createServer } from 'http';
import { WebSocketService } from './services/websocket-service';

const PORT = parseInt(process.env.PORT!) || 3000;
const app = createApp();
const server = createServer(app);

console.log(
  `Connecting to database at ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USERNAME}`
);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    WebSocketService.initialize(server);
    server.listen(PORT, '0.0.0.0', () => {
      console.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log('Error during Data Source initialization:', error));
