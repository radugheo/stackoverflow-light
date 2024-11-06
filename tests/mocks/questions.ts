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

export const expectedQuestion = {
  answerCount: 0,
  answers: [],
  author: {
    auth0Id: 'auth0|123',
    created: '2024-11-05T22:42:04.916Z',
    displayName: 'Test User',
    email: 'test@example.com',
    id: 'b85de3f2-e1c5-4195-8321-76e7b1913c4b',
  },
  content: 'Test Content',
  created: '2024-11-05T22:42:04.979Z',
  id: '812d07c8-6457-4424-8455-dd0f87a29222',
  popularity: 0,
  title: 'Test Question',
  updated: '2024-11-05T22:42:04.979Z',
  voteCount: 0,
  votes: [],
};
