import { AnswerService } from '../../src/services/answer-service';
import { Answer } from '../../src/models/answer-entity';
import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockAnswer1, mockAnswer2 } from '../mocks/answers';
import { mockQuestion1 } from '../mocks/questions';
import { mockUser } from '../mocks/users';
import { ObjectLiteral, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/browser';
import { QuestionService } from '../../src/services/question-service';

describe('Answer Service', () => {
  let answerService: AnswerService = new AnswerService(new QuestionService());
  let mockAnswerRepository: Partial<Repository<Answer>>;
  let mockQuestionRepository: Partial<Repository<Question>>;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    expect.hasAssertions();

    mockAnswerRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
      increment: jest.fn(),
    };

    mockQuestionRepository = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      increment: jest.fn(),
      decrement: jest.fn(),
    };

    mockUserRepository = {
      findOneBy: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockImplementation((entity) => {
      if (entity === Answer) return mockAnswerRepository as Repository<Answer>;
      if (entity === Question) return mockQuestionRepository as Repository<Question>;
      if (entity === User) return mockUserRepository as Repository<User>;
      return {} as Repository<ObjectLiteral>;
    });

    answerService = new AnswerService(new QuestionService());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an answer successfully', async () => {
      const createAnswerDto = {
        content: 'Test Answer',
        authorId: '1',
        questionId: '1',
      };

      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockQuestionRepository, 'findOneBy').mockResolvedValue(mockQuestion1);
      jest.spyOn(mockAnswerRepository, 'create').mockReturnValue(mockAnswer1);
      jest.spyOn(mockAnswerRepository, 'save').mockResolvedValue(mockAnswer1);
      jest
        .spyOn(mockQuestionRepository, 'increment')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await answerService.create(createAnswerDto);

      expect(result).toEqual(mockAnswer1);
    });

    it('should throw error if author not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        answerService.create({
          content: 'Test',
          authorId: '999',
          questionId: '1',
        })
      ).rejects.toThrow('Author not found');
    });

    it('should throw error if question not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockQuestionRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        answerService.create({
          content: 'Test',
          authorId: '1',
          questionId: '999',
        })
      ).rejects.toThrow('Question not found');
    });
  });

  describe('findAll', () => {
    it('should return all answers for a question', async () => {
      const mockAnswers = [mockAnswer1, mockAnswer2];
      jest.spyOn(mockAnswerRepository, 'find').mockResolvedValue(mockAnswers);

      const result = await answerService.findAll('1');

      expect(result).toEqual(mockAnswers);
    });
  });

  describe('findOne', () => {
    it('should return answer with relations', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(mockAnswer1);

      const result = await answerService.findOne('1');

      expect(result).toEqual(mockAnswer1);
    });

    it('should throw error if answer not found', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(null);

      await expect(answerService.findOne('999')).rejects.toThrow('Answer not found');
    });
  });

  describe('update', () => {
    const updateAnswerDto = { content: 'Updated Content' };

    it('should update answer when user is author', async () => {
      const updatedAnswer = { ...mockAnswer1, content: 'Updated Content' };
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(mockAnswer1);
      jest.spyOn(mockAnswerRepository, 'save').mockResolvedValue(updatedAnswer);

      const result = await answerService.update('1', mockUser.id, updateAnswerDto);

      expect(result).toEqual(updatedAnswer);
    });

    it('should throw error when user is not author', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(mockAnswer1);

      await expect(answerService.update('1', '999', updateAnswerDto)).rejects.toThrow(
        'Not authorized to update this answer'
      );
    });

    it('should throw error when answer not found', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(null);

      await expect(answerService.update('999', mockUser.id, updateAnswerDto)).rejects.toThrow(
        'Answer not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete answer when user is author', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(mockAnswer1);
      jest.spyOn(mockAnswerRepository, 'remove').mockResolvedValue(mockAnswer1);
      jest
        .spyOn(mockQuestionRepository, 'decrement')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await answerService.delete('1', mockUser.id);

      expect(mockAnswerRepository.remove).toHaveBeenCalledWith(mockAnswer1);
    });

    it('should throw error when user is not author', async () => {
      jest.spyOn(mockAnswerRepository, 'findOne').mockResolvedValue(mockAnswer1);

      await expect(answerService.delete('1', '999')).rejects.toThrow(
        'Not authorized to delete this answer'
      );
    });
  });
});
