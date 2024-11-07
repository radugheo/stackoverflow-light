/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { Express } from 'express';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { Answer } from '../../src/models/answer-entity';
import { TestDataSource } from '../../src/config/database-config';
import { createApp } from '../../src/app';

describe('Answer API E2E Tests', () => {
  let app: Express;
  let testUser: User;
  let testQuestion: Question;
  let testAnswer: Answer;

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
    const answerRepository = TestDataSource.getRepository(Answer);

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

    testAnswer = await answerRepository.save(
      answerRepository.create({
        content: 'Test Answer Content',
        author: testUser,
        question: testQuestion,
      })
    );
  });

  describe('GET routes', () => {
    it('should get all answers for a question', async () => {
      expect.hasAssertions();
      const response = await request(app).get(`/api/v1/questions/${testQuestion.id}/answers`);

      expect(response.status).toBe(200);
      expect(response.body[0].content).toBe('Test Answer Content');
    });
  });

  describe('POST routes', () => {
    it('should create a new answer', async () => {
      expect.hasAssertions();
      const newAnswer = {
        content: 'New Answer Content',
      };

      const response = await request(app)
        .post(`/api/v1/questions/${testQuestion.id}/answers`)
        .send(newAnswer);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('New Answer Content');
    });
  });

  describe('PUT routes', () => {
    it('should update own answer', async () => {
      expect.hasAssertions();
      const update = {
        content: 'Updated Answer Content',
      };

      const response = await request(app)
        .put(`/api/v1/questions/${testQuestion.id}/answers/${testAnswer.id}`)
        .send(update);

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated Answer Content');
    });

    it('should fail to update non-existent answer', async () => {
      expect.hasAssertions();
      const update = {
        content: 'Updated Content',
      };

      const response = await request(app)
        .put(`/api/v1/questions/${testQuestion.id}/answers/999999`)
        .send(update);

      expect(response.status).toBe(403);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('DELETE routes', () => {
    it('should delete own answer', async () => {
      expect.hasAssertions();

      const response = await request(app).delete(
        `/api/v1/questions/${testQuestion.id}/answers/${testAnswer.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Delete was successful');
    });

    it('should fail to delete non-existent answer', async () => {
      expect.hasAssertions();

      const response = await request(app).delete(
        `/api/v1/questions/${testQuestion.id}/answers/999999`
      );

      expect(response.status).toBe(403);
      expect(response.body.error).toBeDefined();
    });
  });
});
