import { Options } from 'swagger-jsdoc';
import swaggerPaths from '../utils/swagger-paths';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stackoverflow Light',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
    paths: swaggerPaths,
  },
  apis: ['./src/routes/*.ts'],
};

export default swaggerOptions;
