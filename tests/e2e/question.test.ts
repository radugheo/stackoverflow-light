/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { Express } from 'express';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { TestDataSource } from '../../src/config/database-config';
import { createApp } from '../../src/app';
import { expectedQuestion } from '../mocks/questions';

describe('Question API E2E Tests', () => {
  let app: Express;
  let testUser: User;
  let testQuestion: Question;

  beforeAll(async () => {
    await TestDataSource.initialize();
    app = createApp();
  });

  afterAll(async () => {
    await TestDataSource.destroy();
  });

  beforeEach(async () => {
    await TestDataSource.synchronize(true);

    const userRepository = TestDataSource.getRepository(User);
    const questionRepository = TestDataSource.getRepository(Question);

    testUser = await userRepository.save(
      userRepository.create({
        auth0Id: 'auth0|123',
        email: 'test@example.com',
        displayName: 'Test User',
      })
    );

    testQuestion = await questionRepository.save(
      questionRepository.create({
        title: 'Test Question',
        content: 'Test Content',
        author: testUser,
      })
    );
  });

  describe('GET routes', () => {
    it('should get all questions', async () => {
      expect.hasAssertions();
      const response = await request(app).get('/api/questions');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('questions');
    });

    it('should get a specific question', async () => {
      expect.hasAssertions();
      const response = await request(app).get(`/api/questions/${testQuestion.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(expectedQuestion.title);
    });

    it('should return 404 for non-existent question', async () => {
      expect.hasAssertions();

      const response = await request(app).get('/api/questions/999999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST routes', () => {
    it('should create a new question', async () => {
      expect.hasAssertions();
      const newQuestion = {
        title: 'New Question',
        content: 'New Content',
      };

      const response = await request(app).post('/api/questions').send(newQuestion);

      expect(response.status).toBe(200);
      expect(response.body.title).toEqual('New Question');
    });
  });

  describe('PUT routes', () => {
    it('should update own question', async () => {
      expect.hasAssertions();

      const update = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const response = await request(app).put(`/api/questions/${testQuestion.id}`).send(update);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });
  });
});
