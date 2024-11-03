import { VoteService } from '../../src/services/vote-service';
import { Vote } from '../../src/models/vote-entity';
import { User } from '../../src/models/user-entity';
import { Question } from '../../src/models/question-entity';
import { Answer } from '../../src/models/answer-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockUser } from '../mocks/users';
import { ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import {
  mockVoteAnswer,
  mockVoteQuestion,
  mockVoteQuestion2,
  mockVoteWrongUser,
} from '../mocks/votes';
import { AnswerService } from '../../src/services/answer-service';
import { QuestionService } from '../../src/services/question-service';
import { mockQuestion1 } from '../mocks/questions';

describe('Vote Service', () => {
  let voteService: VoteService;
  let mockVoteRepository: Partial<Repository<Vote>>;
  let mockUserRepository: Partial<Repository<User>>;
  let mockQuestionRepository: Partial<Repository<Question>>;
  let mockAnswerRepository: Partial<Repository<Answer>>;

  beforeEach(() => {
    expect.hasAssertions();

    mockVoteRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      remove: jest.fn(),
    };

    mockUserRepository = {
      findOneBy: jest.fn(),
    };

    mockQuestionRepository = {
      increment: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    mockAnswerRepository = {
      increment: jest.fn(),
    };

    jest.spyOn(AppDataSource, 'getRepository').mockImplementation((entity) => {
      if (entity === Vote) return mockVoteRepository as Repository<Vote>;
      if (entity === User) return mockUserRepository as Repository<User>;
      if (entity === Question) return mockQuestionRepository as Repository<Question>;
      if (entity === Answer) return mockAnswerRepository as Repository<Answer>;
      return {} as Repository<ObjectLiteral>;
    });

    voteService = new VoteService(new QuestionService(), new AnswerService(new QuestionService()));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByQuestion', () => {
    it('should find all votes for a question', async () => {
      const mockVotes = [mockVoteQuestion];
      jest.spyOn(mockVoteRepository, 'find').mockResolvedValue(mockVotes);

      const result = await voteService.findByQuestion('1');

      expect(result).toEqual(mockVotes);
    });
  });

  describe('findByAnswer', () => {
    it('should find all votes for an answer', async () => {
      const mockVotes = [mockVoteAnswer];
      jest.spyOn(mockVoteRepository, 'find').mockResolvedValue(mockVotes);

      const result = await voteService.findByAnswer('1');

      expect(result).toEqual(mockVotes);
    });
  });

  describe('findUserVote', () => {
    it('should find user vote for question', async () => {
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(mockVoteQuestion);

      const result = await voteService.findUserVote('1', '1');

      expect(result).toEqual(mockVoteQuestion);
    });

    it('should throw error if neither questionId nor answerId provided', async () => {
      await expect(voteService.findUserVote('1')).rejects.toThrow(
        'Must provide either questionId or answerId'
      );
    });
  });

  describe('create', () => {
    const createVoteDto = {
      userId: '1',
      value: 1 as const,
      questionId: '1',
    };

    const createVoteBothQuestionAndAnswerDto = {
      userId: '1',
      value: 1 as const,
      questionId: '1',
      answerId: '3',
    };

    const createVoteNoQuestionAndAnswerDto = {
      userId: '1',
      value: 1 as const,
    };

    it('should create new vote', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockVoteRepository, 'create').mockReturnValue(mockVoteQuestion);
      jest.spyOn(mockVoteRepository, 'save').mockResolvedValue(mockVoteQuestion);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      const result = await voteService.create(createVoteDto);

      expect(result).toEqual(mockVoteQuestion);
    });

    it('should remove existing vote if same value', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(mockVoteQuestion);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await voteService.create(createVoteDto);

      expect(mockVoteRepository.remove).toHaveBeenCalled();
    });

    it('should update existing vote if different value', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(mockVoteQuestion2);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await voteService.create(createVoteDto);

      expect(mockVoteRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);

      await expect(voteService.create(createVoteDto)).rejects.toThrow('User not found');
    });

    it('should throw error if neither question nor answer are provided', async () => {
      await expect(voteService.create(createVoteNoQuestionAndAnswerDto)).rejects.toThrow(
        'Must provide either questionId or answerId'
      );
    });

    it('should throw error if both question and answer are provided', async () => {
      await expect(voteService.create(createVoteBothQuestionAndAnswerDto)).rejects.toThrow(
        'Cannot vote on both question and answer'
      );
    });
  });

  describe('delete', () => {
    it('should delete vote and update count', async () => {
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(mockVoteQuestion);
      jest.spyOn(mockQuestionRepository, 'findOne').mockResolvedValue(mockQuestion1);
      jest
        .spyOn(mockQuestionRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);

      await voteService.delete('1', mockUser.id);

      expect(mockVoteRepository.remove).toHaveBeenCalled();
    });

    it('should throw error if vote not found', async () => {
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(null);

      await expect(voteService.delete('999', '1')).rejects.toThrow('Vote not found');
    });

    it('should throw error if user not authorized', async () => {
      jest.spyOn(mockVoteRepository, 'findOne').mockResolvedValue(mockVoteWrongUser);

      await expect(voteService.delete('1', '1')).rejects.toThrow(
        'Not authorized to delete this vote'
      );
    });
  });
});
