import { Vote } from '../../src/models/vote-entity';
import { mockAnswer1 } from './answers';
import { mockQuestion1 } from './questions';
import { mockUser } from './users';

export const mockVoteQuestion = {
  id: '1',
  value: 1,
  user: mockUser,
  question: mockQuestion1,
  created: new Date(),
} as Vote;

export const mockVoteQuestion2 = {
  id: '1',
  value: -1,
  user: mockUser,
  question: mockQuestion1,
  created: new Date(),
} as Vote;

export const mockVoteAnswer = {
  id: '1',
  value: 1,
  user: mockUser,
  answer: mockAnswer1,
  created: new Date(),
} as Vote;

export const mockVoteWrongUser = {
  id: '1',
  value: 1,
  user: { ...mockUser, id: '999' },
  answer: mockAnswer1,
  created: new Date(),
} as Vote;
