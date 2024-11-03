import { MetricsService } from '../../src/services/metrics-service';
import { Question } from '../../src/models/question-entity';
import { Answer } from '../../src/models/answer-entity';
import { Vote } from '../../src/models/vote-entity';
import { User } from '../../src/models/user-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockQuestion1 } from '../mocks/questions';
import { ObjectLiteral, Repository } from 'typeorm';

describe('Metrics Service', () => {
  let metricsService: MetricsService = new MetricsService();
  let mockQuestionRepository: Partial<Repository<Question>>;
  let mockAnswerRepository: Partial<Repository<Answer>>;
  let mockVoteRepository: Partial<Repository<Vote>>;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    expect.hasAssertions();

    mockQuestionRepository = {
      find: jest.fn(),
      count: jest.fn(),
    };

    mockAnswerRepository = {
      count: jest.fn(),
    };

    mockVoteRepository = {
      count: jest.fn(),
    };

    mockUserRepository = {
      count: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockImplementation((entity) => {
      if (entity === Question) return mockQuestionRepository as Repository<Question>;
      if (entity === Answer) return mockAnswerRepository as Repository<Answer>;
      if (entity === Vote) return mockVoteRepository as Repository<Vote>;
      if (entity === User) return mockUserRepository as Repository<User>;
      return {} as Repository<ObjectLiteral>;
    });

    metricsService = new MetricsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMetrics', () => {
    it('should return metrics when data exists', async () => {
      const mockQuestions = [mockQuestion1];

      jest.spyOn(mockQuestionRepository, 'find').mockResolvedValue(mockQuestions);
      jest.spyOn(mockQuestionRepository, 'count').mockResolvedValue(10);
      jest.spyOn(mockAnswerRepository, 'count').mockResolvedValue(20);
      jest.spyOn(mockVoteRepository, 'count').mockResolvedValue(30);
      jest.spyOn(mockUserRepository, 'count').mockResolvedValue(2);

      const result = await metricsService.getMetrics();

      expect(result.mostPopularPost).toEqual({
        questionId: mockQuestion1.id,
        title: mockQuestion1.title,
        votes: mockQuestion1.voteCount,
        answers: mockQuestion1.answerCount,
        popularity: mockQuestion1.popularity,
      });

      expect(result.totals).toEqual({
        questions: 10,
        answers: 20,
        votes: 30,
        users: 2,
      });

      expect(result.averages).toEqual({
        questionsPerUser: 5,
        answersPerUser: 10,
        votesPerUser: 15,
      });
    });

    it('should handle empty database', async () => {
      jest.spyOn(mockQuestionRepository, 'find').mockResolvedValue([]);
      jest.spyOn(mockQuestionRepository, 'count').mockResolvedValue(0);
      jest.spyOn(mockAnswerRepository, 'count').mockResolvedValue(0);
      jest.spyOn(mockVoteRepository, 'count').mockResolvedValue(0);
      jest.spyOn(mockUserRepository, 'count').mockResolvedValue(0);

      const result = await metricsService.getMetrics();

      expect(result.mostPopularPost).toEqual({
        questionId: '',
        title: 'No questions this week',
        votes: 0,
        answers: 0,
        popularity: 0,
      });
    });
  });
});
