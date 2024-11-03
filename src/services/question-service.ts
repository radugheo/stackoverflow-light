import { Repository } from 'typeorm';
import { Question } from '../models/question-entity';
import { User } from '../models/user-entity';
import { AppDataSource } from '../config/database-config';
import {
  CreateQuestionDto,
  FindQuestionsOptions,
  UpdateQuestionDto,
} from '../types/question-types';

export class QuestionService {
  private questionRepository: Repository<Question>;
  private userRepository: Repository<User>;

  constructor() {
    this.questionRepository = AppDataSource.getRepository(Question);
    this.userRepository = AppDataSource.getRepository(User);
  }

  findAll = async (options: FindQuestionsOptions = {}) => {
    const { page = 1, limit = 10, sortBy = 'newest' } = options;

    const [questions, total] = await this.questionRepository.findAndCount({
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: sortBy === 'newest' ? { created: 'DESC' } : { voteCount: 'DESC' }, // to do: change popularity criteria
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

    return this.questionRepository.save(question);
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
    return this.questionRepository.save(question);
  };

  delete = async (id: string, userId: string): Promise<void> => {
    const question = await this.findOne(id);

    if (question.author.id !== userId) {
      throw new Error('Not authorized to delete this question');
    }

    await this.questionRepository.remove(question);
  };

  updateVoteCount = async (id: string, value: number): Promise<void> => {
    await this.questionRepository.increment({ id }, 'voteCount', value);
  };

  updateAnswerCount = async (id: string, value: number): Promise<void> => {
    await this.questionRepository.increment({ id }, 'answerCount', value);
  };
}
