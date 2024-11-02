import { Repository } from 'typeorm';
import { User } from '../../src/models/user-entity';
import { Question } from '../../src/models/question-entity';

export const mockQuestionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
} as Partial<Repository<Question>>;

export const mockUserRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
} as Partial<Repository<User>>;
