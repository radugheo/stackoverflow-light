import { Repository } from 'typeorm';
import { Answer } from '../models/answer-entity';
import { User } from '../models/user-entity';
import { Question } from '../models/question-entity';
import { AppDataSource } from '../config/database-config';
import { CreateAnswerDto, UpdateAnswerDto } from '../types/answer-types';
import { QuestionService } from './question-service';

export class AnswerService {
  private answerRepository: Repository<Answer>;
  private questionRepository: Repository<Question>;
  private userRepository: Repository<User>;

  constructor(private questionService: QuestionService) {
    this.answerRepository = AppDataSource.getRepository(Answer);
    this.questionRepository = AppDataSource.getRepository(Question);
    this.userRepository = AppDataSource.getRepository(User);
  }

  findAll = async (questionId: string): Promise<Answer[]> => {
    const answers = await this.answerRepository.find({
      where: { question: { id: questionId } },
      relations: {
        author: true,
        votes: true,
      },
      order: {
        voteCount: 'DESC',
        created: 'DESC',
      },
    });

    return answers;
  };

  findOne = async (id: string): Promise<Answer> => {
    const answer = await this.answerRepository.findOne({
      where: { id },
      relations: {
        author: true,
        question: true,
        votes: true,
      },
    });

    if (!answer) {
      throw new Error('Answer not found');
    }

    return answer;
  };

  create = async (createAnswerDto: CreateAnswerDto): Promise<Answer> => {
    const author = await this.userRepository.findOneBy({ id: createAnswerDto.authorId });
    if (!author) {
      throw new Error('Author not found');
    }

    const question = await this.questionRepository.findOneBy({ id: createAnswerDto.questionId });
    if (!question) {
      throw new Error('Question not found');
    }

    const answer = this.answerRepository.create({
      content: createAnswerDto.content,
      author,
      question,
    });

    await this.answerRepository.save(answer);
    await this.questionService.updateAnswerCount(question.id, 1);

    return answer;
  };

  update = async (
    id: string,
    userId: string,
    updateAnswerDto: UpdateAnswerDto
  ): Promise<Answer> => {
    const answer = await this.findOne(id);

    if (answer.author.id !== userId) {
      throw new Error('Not authorized to update this answer');
    }

    Object.assign(answer, updateAnswerDto);
    return this.answerRepository.save(answer);
  };

  delete = async (id: string, userId: string): Promise<void> => {
    const answer = await this.findOne(id);

    if (answer.author.id !== userId) {
      throw new Error('Not authorized to delete this answer');
    }

    await this.answerRepository.remove(answer);
    await this.questionService.updateAnswerCount(answer.question.id, -1);
  };

  updateVoteCount = async (id: string, value: number): Promise<void> => {
    await this.answerRepository.increment({ id }, 'voteCount', value);
  };
}
