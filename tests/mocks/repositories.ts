import { Repository } from 'typeorm';
import { User } from '../../src/models/user-entity';
import { Question } from '../../src/models/question-entity';

export const mockQuestionRepository: Partial<Repository<Question>> = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
};

export const mockUserRepository: Partial<Repository<User>> = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};
