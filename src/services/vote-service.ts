import { Repository } from 'typeorm';
import { Vote } from '../models/vote-entity';
import { User } from '../models/user-entity';
import { Question } from '../models/question-entity';
import { Answer } from '../models/answer-entity';
import { AppDataSource } from '../config/database-config';
import { CreateVoteDto } from '../types/vote-types';

export class VoteService {
  private voteRepository: Repository<Vote>;
  private userRepository: Repository<User>;
  private questionRepository: Repository<Question>;
  private answerRepository: Repository<Answer>;

  constructor() {
    this.voteRepository = AppDataSource.getRepository(Vote);
    this.userRepository = AppDataSource.getRepository(User);
    this.questionRepository = AppDataSource.getRepository(Question);
    this.answerRepository = AppDataSource.getRepository(Answer);
  }

  findByQuestion = async (questionId: string): Promise<Vote[]> => {
    return this.voteRepository.find({
      where: { question: { id: questionId } },
      relations: {
        user: true,
        question: true,
      },
    });
  };

  findByAnswer = async (answerId: string): Promise<Vote[]> => {
    return this.voteRepository.find({
      where: { answer: { id: answerId } },
      relations: {
        user: true,
        answer: true,
      },
    });
  };

  findUserVote = async (
    userId: string,
    questionId?: string,
    answerId?: string
  ): Promise<Vote | null> => {
    if (!questionId && !answerId) {
      throw new Error('Must provide either questionId or answerId');
    }

    if (questionId && answerId) {
      throw new Error('Cannot provide both question and answer');
    }

    return this.voteRepository.findOne({
      where: questionId
        ? { user: { id: userId }, question: { id: questionId } }
        : { user: { id: userId }, answer: { id: answerId } },
      relations: {
        user: true,
        ...(questionId ? { question: true } : { answer: true }),
      },
    });
  };

  create = async (createVoteDto: CreateVoteDto): Promise<Vote> => {
    const { userId, value, questionId, answerId } = createVoteDto;

    if (!questionId && !answerId) {
      throw new Error('Must provide either questionId or answerId');
    }

    if (questionId && answerId) {
      throw new Error('Cannot vote on both question and answer');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const existingVote = await this.findUserVote(userId, questionId, answerId);
    if (existingVote) {
      return this.handleExistingVote(existingVote, value);
    }

    const vote = this.voteRepository.create({
      user,
      value,
      ...(questionId ? { question: { id: questionId } } : { answer: { id: answerId } }),
    });

    await this.voteRepository.save(vote);
    await this.updateTargetVoteCount(value, questionId, answerId);

    return vote;
  };

  delete = async (id: string, userId: string): Promise<void> => {
    const vote = await this.voteRepository.findOne({
      where: { id },
      relations: {
        user: true,
        question: true,
        answer: true,
      },
    });

    if (!vote) {
      throw new Error('Vote not found');
    }

    if (vote.user.id !== userId) {
      throw new Error('Not authorized to delete this vote');
    }

    await this.voteRepository.remove(vote);
    await this.updateTargetVoteCount(-vote.value, vote.question?.id, vote.answer?.id);
  };

  private handleExistingVote = async (existingVote: Vote, newValue: number): Promise<Vote> => {
    const questionId = existingVote.question?.id;
    const answerId = existingVote.answer?.id;

    if (existingVote.value === newValue) {
      await this.voteRepository.remove(existingVote);
      await this.updateTargetVoteCount(-newValue, questionId, answerId);
      return existingVote;
    }

    existingVote.value = newValue;
    await this.voteRepository.save(existingVote);
    await this.updateTargetVoteCount(2 * newValue, questionId, answerId);
    return existingVote;
  };

  private updateTargetVoteCount = async (
    value: number,
    questionId?: string,
    answerId?: string
  ): Promise<void> => {
    if (questionId) {
      await this.questionRepository.increment({ id: questionId }, 'voteCount', value);
    } else if (answerId) {
      await this.answerRepository.increment({ id: answerId }, 'voteCount', value);
    }
  };
}
