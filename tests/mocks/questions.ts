import { Question } from '../../src/models/question-entity';
import { User } from '../../src/models/user-entity';

export const mockQuestion1 = {
  id: '1',
  title: 'Test Question',
  content: 'Test Content',
  voteCount: 5,
  answerCount: 0,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  answers: [],
  popularity: 1,
  votes: [],
} as Question;

export const mockQuestion2 = {
  id: '2',
  title: 'Test Question',
  content: 'Test Content',
  voteCount: 8,
  answerCount: 0,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  answers: [],
  popularity: 1,
  votes: [],
} as Question;

export const mockQuestion3 = {
  id: '3',
  title: 'Test Question',
  content: 'Test Content',
  voteCount: 9,
  answerCount: 0,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  answers: [],
  popularity: 1,
  votes: [],
} as Question;

export const mockQuestion4 = {
  id: '4',
  title: 'Test Question',
  content: 'Test Content',
  voteCount: 12,
  answerCount: 0,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  answers: [],
  popularity: 1,
  votes: [],
} as Question;
