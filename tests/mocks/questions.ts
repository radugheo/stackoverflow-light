import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';

export const mockQuestion = {
  id: '1',
  title: 'Test Question',
  content: 'Test Content',
  voteCount: 0,
  answerCount: 0,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  answers: [],
  votes: [],
} as Question;
