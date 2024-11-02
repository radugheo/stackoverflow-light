import { QuestionService } from '../../src/services/question-service';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockQuestion1, mockQuestion2, mockQuestion3, mockQuestion4 } from '../mocks/questions';
import { mockUser } from '../mocks/users';
import { ObjectLiteral, Repository } from 'typeorm';

describe('Question Service', () => {
  let questionService: QuestionService = new QuestionService();
  let mockQuestionRepository: Partial<Repository<Question>>;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    expect.hasAssertions();

    mockQuestionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    };

    mockUserRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockImplementation((entity) => {
      if (entity === Question) return mockQuestionRepository as Repository<Question>;
      if (entity === User) return mockUserRepository as Repository<User>;
      return {} as Repository<ObjectLiteral>;
    });

    questionService = new QuestionService();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a question successfully', async () => {
      const createQuestionDto = {
        title: 'Test Question',
        content: 'Test Content',
        authorId: '1',
      };

      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockQuestionRepository, 'create').mockReturnValue(mockQuestion1);
      jest.spyOn(mockQuestionRepository, 'save').mockResolvedValue(mockQuestion1);

      const result = await questionService.create(createQuestionDto);

      expect(result).toEqual(mockQuestion1);
    });

    it('should throw error if author not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        questionService.create({
          title: 'Test',
          content: 'Test',
          authorId: '999',
        })
      ).rejects.toThrow('Author not found');
    });
  });

  describe('findAll', () => {
    it('should return questions with pagination using default options', async () => {
      const mockQuestions = [mockQuestion1, mockQuestion2, mockQuestion3, mockQuestion4];
      const mockTotal = 1;

      jest
        .spyOn(mockQuestionRepository, 'findAndCount')
        .mockResolvedValue([mockQuestions, mockTotal]);

      const result = await questionService.findAll();

      expect(result).toEqual({
        questions: mockQuestions,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTotal,
          pages: 1,
        },
      });
    });

    it('should return questions with custom pagination and sorting', async () => {
      const mockQuestions = [mockQuestion3, mockQuestion4];
      const mockTotal = 1;
      const options = {
        page: 2,
        limit: 2,
        sortBy: 'popular' as const,
      };

      jest
        .spyOn(mockQuestionRepository, 'findAndCount')
        .mockResolvedValue([mockQuestions, mockTotal]);

      const result = await questionService.findAll(options);

      expect(result).toEqual({
        questions: [mockQuestion3, mockQuestion4],
        pagination: {
          page: 2,
          limit: 2,
          total: mockTotal,
          pages: 1,
        },
      });
    });

    it('should handle empty results', async () => {
      jest.spyOn(mockQuestionRepository, 'findAndCount').mockResolvedValue([[], 0]);

      const result = await questionService.findAll();

      expect(result).toEqual({
        questions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return question with relations', async () => {
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);

      const result = await questionService.findOne('1');

      expect(result).toEqual(mockQuestion1);
    });

    it('should throw error if question not found', async () => {
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(null);

      await expect(questionService.findOne('999')).rejects.toThrow('Question not found');
    });
  });
});
