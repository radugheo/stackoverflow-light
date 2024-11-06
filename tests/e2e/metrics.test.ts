/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest';
import { Express } from 'express';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { Answer } from '../../src/models/answer-entity';
import { Vote } from '../../src/models/vote-entity';
import { TestDataSource } from '../../src/config/database-config';
import { createApp } from '../../src/app';

describe('Metrics API E2E Tests', () => {
  let app: Express;
  let testUser1: User;
  let testUser2: User;
  let popularQuestion: Question;
  let oldQuestion: Question;

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

    testUser1 = await userRepository.save(
      userRepository.create({
        auth0Id: 'auth0|123',
        email: 'test1@example.com',
        displayName: 'Test User 1',
      })
    );

    testUser2 = await userRepository.save(
      userRepository.create({
        auth0Id: 'auth0|456',
        email: 'test2@example.com',
        displayName: 'Test User 2',
      })
    );

    popularQuestion = await questionRepository.save(
      questionRepository.create({
        title: 'Popular Question',
        content: 'Popular Content',
        author: testUser1,
        popularity: 10,
        voteCount: 5,
        answerCount: 2,
      })
    );

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    oldQuestion = await questionRepository.save(
      questionRepository.create({
        title: 'Old Question',
        content: 'Old Content',
        author: testUser2,
        created: twoWeeksAgo,
        popularity: 5,
        voteCount: 2,
        answerCount: 1,
      })
    );

    await answerRepository.save([
      answerRepository.create({
        content: 'Answer 1',
        author: testUser1,
        question: popularQuestion,
      }),
      answerRepository.create({
        content: 'Answer 2',
        author: testUser2,
        question: popularQuestion,
      }),
      answerRepository.create({
        content: 'Answer 3',
        author: testUser1,
        question: oldQuestion,
      }),
    ]);

    await voteRepository.save([
      voteRepository.create({
        value: 1,
        user: testUser1,
        question: popularQuestion,
      }),
      voteRepository.create({
        value: 1,
        user: testUser2,
        question: popularQuestion,
      }),
      voteRepository.create({
        value: 1,
        user: testUser1,
        question: oldQuestion,
      }),
    ]);
  });

  describe('GET routes', () => {
    it('should return complete metrics data', async () => {
      expect.hasAssertions();

      const response = await request(app).get('/api/metrics');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mostPopularPost: {
          questionId: popularQuestion.id,
          title: 'Popular Question',
          votes: 5,
          answers: 2,
          popularity: 10,
        },
        totals: {
          questions: 2,
          answers: 3,
          votes: 3,
          users: 2,
        },
        averages: {
          questionsPerUser: 1,
          answersPerUser: 1.5,
          votesPerUser: 1.5,
        },
      });
    });
  });
});
