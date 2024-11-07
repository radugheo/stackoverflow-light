import { Repository } from 'typeorm';
import { Question } from '../models/question-entity';
import { User } from '../models/user-entity';
import { AppDataSource } from '../config/database-config';
import {
  CreateQuestionDto,
  FindQuestionsOptions,
  UpdateQuestionDto,
} from '../types/question-types';
import { WebSocketService } from './websocket-service';
import { WebSocketEvents } from '../types/websocket-types';
import { calculatePopularity } from '../utils/helpers';

export class QuestionService {
  private questionRepository: Repository<Question>;
  private userRepository: Repository<User>;

  constructor() {
    this.questionRepository = AppDataSource.getRepository(Question);
    this.userRepository = AppDataSource.getRepository(User);
  }

  findAll = async (options: FindQuestionsOptions = {}) => {
    const { page = 1, limit = 10, sortBy = 'popular' } = options;

    const [questions, total] = await this.questionRepository.findAndCount({
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: sortBy === 'newest' ? { created: 'DESC' } : { popularity: 'DESC' },
    });

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  };

  findOne = async (id: string): Promise<Question> => {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: {
        author: true,
        answers: {
          author: true,
          votes: true,
        },
        votes: true,
      },
    });

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  };

  create = async (createQuestionDto: CreateQuestionDto): Promise<Question> => {
    const author = await this.userRepository.findOneBy({ id: createQuestionDto.authorId });
    if (!author) {
      throw new Error('Author not found');
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      author,
    });

    const savedQuestion = await this.questionRepository.save(question);

    WebSocketService.emit(WebSocketEvents.QUESTION_CREATED, {
      id: savedQuestion.id,
      title: savedQuestion.title,
      content: savedQuestion.content,
      authorId: savedQuestion.author.id,
      voteCount: savedQuestion.voteCount,
      answerCount: savedQuestion.answerCount,
    });

    return savedQuestion;
  };

  update = async (
    id: string,
    userId: string,
    updateQuestionDto: UpdateQuestionDto
  ): Promise<Question> => {
    const question = await this.findOne(id);

    if (question.author.id !== userId) {
      throw new Error('Not authorized to update this question');
    }

    Object.assign(question, updateQuestionDto);
    const updatedQuestion = await this.questionRepository.save(question);

    WebSocketService.emit(WebSocketEvents.QUESTION_UPDATED, {
      id: updatedQuestion.id,
      title: updatedQuestion.title,
      content: updatedQuestion.content,
      authorId: updatedQuestion.author.id,
      voteCount: updatedQuestion.voteCount,
      answerCount: updatedQuestion.answerCount,
    });

    return updatedQuestion;
  };

  delete = async (id: string, userId: string): Promise<void> => {
    const question = await this.findOne(id);

    if (question.author.id !== userId) {
      throw new Error('Not authorized to delete this question');
    }

    await this.questionRepository.remove(question);
    WebSocketService.emit(WebSocketEvents.QUESTION_DELETED, { id });
  };

  private updatePopularity = async (question: Question): Promise<void> => {
    const newPopularity = calculatePopularity(
      question.voteCount,
      question.answerCount,
      question.created
    );

    await this.questionRepository.update({ id: question.id }, { popularity: newPopularity });
  };

  updateVoteCount = async (id: string, value: number): Promise<void> => {
    await this.questionRepository.increment({ id }, 'voteCount', value);
    const question = await this.findOne(id);
    await this.updatePopularity(question);

    WebSocketService.emit(WebSocketEvents.QUESTION_VOTED, {
      id: question.id,
      title: question.title,
      content: question.content,
      authorId: question.author.id,
      voteCount: question.voteCount,
      answerCount: question.answerCount,
    });
  };

  updateAnswerCount = async (id: string, value: number): Promise<void> => {
    await this.questionRepository.increment({ id }, 'answerCount', value);
    const question = await this.findOne(id);
    await this.updatePopularity(question);

    WebSocketService.emit(WebSocketEvents.QUESTION_ANSWERED, {
      id: question.id,
      title: question.title,
      content: question.content,
      authorId: question.author.id,
      voteCount: question.voteCount,
      answerCount: question.answerCount,
    });
  };
}
