import { QuestionService } from '../../src/services/question-service';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockQuestion } from '../mocks/questions';
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
      jest.spyOn(mockQuestionRepository, 'create').mockReturnValue(mockQuestion);
      jest.spyOn(mockQuestionRepository, 'save').mockResolvedValue(mockQuestion);

      const result = await questionService.create(createQuestionDto);

      expect(result).toEqual(mockQuestion);
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

  describe('findOne', () => {
    it('should return question with relations', async () => {
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion);

      const result = await questionService.findOne('1');

      expect(result).toEqual(mockQuestion);
    });

    it('should throw error if question not found', async () => {
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(null);

      await expect(questionService.findOne('999')).rejects.toThrow('Question not found');
    });
  });
});
