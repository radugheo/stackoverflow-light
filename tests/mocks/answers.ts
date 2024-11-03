import { Answer } from '../../src/models/answer-entity';
import { User } from '../../src/models/user-entity';
import { mockQuestion1, mockQuestion2 } from './questions';

export const mockAnswer1 = {
  id: '1',
  content: 'Test Content',
  question: mockQuestion1,
  created: new Date(),
  updated: new Date(),
  author: { id: '1' } as User,
  voteCount: 4,
  votes: [],
} as Answer;

export const mockAnswer2 = {
  id: '2',
  content: 'Test Content',
  question: mockQuestion2,
  created: new Date(),
  updated: new Date(),
  author: { id: '2' } as User,
  voteCount: 5,
  votes: [],
} as Answer;
