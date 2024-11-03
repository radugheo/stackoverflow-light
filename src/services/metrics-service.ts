import { MoreThanOrEqual, Repository } from 'typeorm';
import { Question } from '../models/question-entity';
import { Answer } from '../models/answer-entity';
import { Vote } from '../models/vote-entity';
import { User } from '../models/user-entity';
import { AppDataSource } from '../config/database-config';
import { Metrics } from '../types/metrics-type';

export class MetricsService {
  private questionRepository: Repository<Question>;
  private answerRepository: Repository<Answer>;
  private voteRepository: Repository<Vote>;
  private userRepository: Repository<User>;

  constructor() {
    this.questionRepository = AppDataSource.getRepository(Question);
    this.answerRepository = AppDataSource.getRepository(Answer);
    this.voteRepository = AppDataSource.getRepository(Vote);
    this.userRepository = AppDataSource.getRepository(User);
  }

  getMetrics = async (): Promise<Metrics> => {
    const [mostPopularPost, totals, averages] = await Promise.all([
      this.getMostPopularPost(),
      this.getTotals(),
      this.getAverages(),
    ]);

    return {
      mostPopularPost,
      averages,
      totals,
    };
  };

  private getMostPopularPost = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const questions = await this.questionRepository.find({
      where: {
        created: MoreThanOrEqual(oneWeekAgo),
      },
      relations: ['votes'],
      order: {
        popularity: 'DESC',
      },
      take: 1,
    });

    const topQuestion = questions[0];

    if (!topQuestion) {
      return {
        questionId: '',
        title: 'No questions this week',
        votes: 0,
        answers: 0,
        popularity: 0,
      };
    }

    return {
      questionId: topQuestion.id,
      title: topQuestion.title,
      votes: topQuestion.voteCount,
      answers: topQuestion.answerCount,
      popularity: topQuestion.popularity,
    };
  };

  private getTotals = async () => {
    const [questions, answers, votes, users] = await Promise.all([
      this.questionRepository.count(),
      this.answerRepository.count(),
      this.voteRepository.count(),
      this.userRepository.count(),
    ]);

    return {
      questions,
      answers,
      votes,
      users,
    };
  };

  private getAverages = async () => {
    const { questions, answers, votes, users } = await this.getTotals();

    return {
      questionsPerUser: users ? Number((questions / users).toFixed(2)) : 0,
      answersPerUser: users ? Number((answers / users).toFixed(2)) : 0,
      votesPerUser: users ? Number((votes / users).toFixed(2)) : 0,
    };
  };
}
