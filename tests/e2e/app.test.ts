/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { Express } from 'express';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { TestDataSource } from '../../src/config/database-config';
import { createApp } from '../../src/app';
import { expectedQuestion } from '../mocks/questions';

jest.mock('../../src/config/database-config', () => {
  const actual = jest.requireActual('../../src/config/database-config');
  return {
    ...actual,
    AppDataSource: actual.TestDataSource,
  };
});

jest.mock('express-openid-connect', () => ({
  auth: () => (req: any, _res: any, next: any) => {
    console.log('Auth middleware called');
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    next();
  },
}));

jest.mock('../../src/config/redis-config', () => ({
  redis: {
    get: jest.fn(),
    setex: jest.fn(),
    keys: jest.fn(),
    del: jest.fn(),
  },
}));

describe('Question API E2E Tests', () => {
  let app: Express;
  let testUser: User;
  let testQuestion: Question;

  beforeAll(async () => {
    try {
      await TestDataSource.initialize();
      console.log('Test database initialized');
      app = createApp();
    } catch (error) {
      console.error('Error in beforeAll:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await TestDataSource.destroy();
      console.log('Test database connection closed');
    } catch (error) {
      console.error('Error in afterAll:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      await TestDataSource.synchronize(true);
      console.log('Database synchronized');

      const userRepository = TestDataSource.getRepository(User);
      const questionRepository = TestDataSource.getRepository(Question);

      testUser = await userRepository.save(
        userRepository.create({
          auth0Id: 'auth0|123',
          email: 'test@example.com',
          displayName: 'Test User',
        })
      );
      console.log('Test user created:', testUser);

      testQuestion = await questionRepository.save(
        questionRepository.create({
          title: 'Test Question',
          content: 'Test Content',
          author: testUser,
        })
      );
      console.log('Test question created:', testQuestion);
    } catch (error) {
      console.error('Error in beforeEach:', error);
      throw error;
    }
  });

  describe('Question API', () => {
    it('should get all questions', async () => {
      const response = await request(app).get('/api/questions').expect(200);

      expect(response.body).toHaveProperty('questions');
    });

    it('should get a specific question', async () => {
      const response = await request(app).get(`/api/questions/${testQuestion.id}`).expect(200);

      expect(response.body.title).toBe(expectedQuestion.title);
    });

    it('should create a new question', async () => {
      const newQuestion = {
        title: 'New Question',
        content: 'New Content',
      };

      const response = await request(app).post('/api/questions').send(newQuestion).expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', newQuestion.title);
      expect(response.body).toHaveProperty('content', newQuestion.content);
      expect(response.body).toHaveProperty('author');
      expect(response.body.author).toHaveProperty('id', testUser.id);

      const savedQuestion = await TestDataSource.manager.findOne(Question, {
        where: { id: response.body.id },
        relations: { author: true },
      });

      expect(savedQuestion).toBeDefined();
      expect(savedQuestion?.title).toBe(newQuestion.title);
      expect(savedQuestion?.content).toBe(newQuestion.content);
      expect(savedQuestion?.author.id).toBe(testUser.id);
    });
  });
});
