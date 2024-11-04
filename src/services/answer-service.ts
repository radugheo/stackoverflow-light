import { Repository } from 'typeorm';
import { Answer } from '../models/answer-entity';
import { User } from '../models/user-entity';
import { Question } from '../models/question-entity';
import { AppDataSource } from '../config/database-config';
import { CreateAnswerDto, UpdateAnswerDto } from '../types/answer-types';
import { QuestionService } from './question-service';
import { WebSocketService } from './websocket-service';
import { WebSocketEvents } from '../types/websocket-types';

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

    const savedAnswer = await this.answerRepository.save(answer);
    await this.questionService.updateAnswerCount(question.id, 1);

    WebSocketService.emit(WebSocketEvents.ANSWER_CREATED, {
      id: savedAnswer.id,
      content: savedAnswer.content,
      questionId: savedAnswer.question.id,
      authorId: savedAnswer.author.id,
      voteCount: savedAnswer.voteCount,
    });

    return savedAnswer;
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
    const updatedAnswer = await this.answerRepository.save(answer);

    WebSocketService.emit(WebSocketEvents.ANSWER_UPDATED, {
      id: updatedAnswer.id,
      content: updatedAnswer.content,
      questionId: updatedAnswer.question.id,
      authorId: updatedAnswer.author.id,
      voteCount: updatedAnswer.voteCount,
    });
    return updatedAnswer;
  };

  delete = async (id: string, userId: string): Promise<void> => {
    const answer = await this.findOne(id);

    if (answer.author.id !== userId) {
      throw new Error('Not authorized to delete this answer');
    }

    const questionId = answer.question.id;
    await this.answerRepository.remove(answer);
    await this.questionService.updateAnswerCount(questionId, -1);

    WebSocketService.emit(WebSocketEvents.ANSWER_DELETED, {
      id: answer.id,
      questionId,
    });
  };

  updateVoteCount = async (id: string, value: number): Promise<void> => {
    await this.answerRepository.increment({ id }, 'voteCount', value);
    const answer = await this.findOne(id);

    WebSocketService.emit(WebSocketEvents.ANSWER_VOTED, {
      id: answer.id,
      content: answer.content,
      questionId: answer.question.id,
      authorId: answer.author.id,
      voteCount: answer.voteCount,
    });
  };
}
