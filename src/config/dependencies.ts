import { AnswerController } from '../controllers/answer-controller';
import { MetricsController } from '../controllers/metrics-controller';
import { QuestionController } from '../controllers/question-controller';
import { UserController } from '../controllers/user-controller';
import { VoteController } from '../controllers/vote-controller';
import { AnswerService } from '../services/answer-service';
import { MetricsService } from '../services/metrics-service';
import { QuestionService } from '../services/question-service';
import { UserService } from '../services/user-service';
import { VoteService } from '../services/vote-service';

export const userService = new UserService();
export const questionService = new QuestionService();
export const answerService = new AnswerService(questionService);
export const voteService = new VoteService(questionService, answerService);
export const metricsService = new MetricsService();

export const userController = new UserController(userService);
export const questionController = new QuestionController(questionService);
export const answerController = new AnswerController(answerService);
export const voteController = new VoteController(voteService);
export const metricsController = new MetricsController(metricsService);
