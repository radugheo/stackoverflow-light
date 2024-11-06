/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { Express } from 'express';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { Answer } from '../../src/models/answer-entity';
import { Vote } from '../../src/models/vote-entity';
import { TestDataSource } from '../../src/config/database-config';
import { createApp } from '../../src/app';

describe('Vote API E2E Tests', () => {
  let app: Express;
  let testUser: User;
  let testQuestion: Question;
  let testAnswer: Answer;
  let testVote: Vote;

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
    const voteRepository = TestDataSource.getRepository(Vote);

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

    testVote = await voteRepository.save(
      voteRepository.create({
        value: 1,
        user: testUser,
        question: testQuestion,
      })
    );
  });

  describe('POST routes', () => {
    it('should create a vote for a question', async () => {
      expect.hasAssertions();
      const newVote = {
        value: 1,
        questionId: testQuestion.id,
      };

      const response = await request(app).post('/api/votes').send(newVote);

      expect(response.status).toBe(200);
      expect(response.body.value).toBe(1);
    });

    it('should create a vote for an answer', async () => {
      expect.hasAssertions();
      const newVote = {
        value: 1,
        answerId: testAnswer.id,
      };

      const response = await request(app).post('/api/votes').send(newVote);

      expect(response.status).toBe(200);
      expect(response.body.value).toBe(1);
    });

    it('should fail when trying to vote on both question and answer', async () => {
      expect.hasAssertions();
      const invalidVote = {
        value: 1,
        questionId: testQuestion.id,
        answerId: testAnswer.id,
      };

      const response = await request(app).post('/api/votes').send(invalidVote);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should update existing vote when voting again', async () => {
      expect.hasAssertions();
      const updateVote = {
        value: -1,
        questionId: testQuestion.id,
      };

      const response = await request(app).post('/api/votes').send(updateVote);

      expect(response.status).toBe(200);
      expect(response.body.value).toBe(-1);
    });
  });

  describe('DELETE routes', () => {
    it('should delete own vote', async () => {
      expect.hasAssertions();

      const response = await request(app).delete(`/api/votes/${testVote.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Delete was successful');
    });

    it('should fail to delete non-existent vote', async () => {
      expect.hasAssertions();

      const response = await request(app).delete('/api/votes/999999');

      expect(response.status).toBe(403);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET routes', () => {
    it('should get user vote for a question', async () => {
      expect.hasAssertions();

      const response = await request(app)
        .get('/api/votes/user')
        .query({ questionId: testQuestion.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should get user vote for an answer', async () => {
      expect.hasAssertions();

      const response = await request(app).get('/api/votes/user').query({ answerId: testAnswer.id });

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should fail when querying without questionId or answerId', async () => {
      expect.hasAssertions();

      const response = await request(app).get('/api/votes/user');

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should fail when querying with both questionId and answerId', async () => {
      expect.hasAssertions();

      const response = await request(app).get('/api/votes/user').query({
        questionId: testQuestion.id,
        answerId: testAnswer.id,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
