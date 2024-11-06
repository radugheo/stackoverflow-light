import { Answer } from '../models/answer-entity';
import { Question } from '../models/question-entity';
import { User } from '../models/user-entity';
import { Vote } from '../models/vote-entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Question, Answer, Vote],
  synchronize: true,
});

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: 'postgres',
  database: 'test_db',
  entities: [User, Question, Answer, Vote],
  synchronize: true,
});
