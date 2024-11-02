import { User } from '../../src/models/user-entity';

export const mockUser = {
  id: '1',
  email: 'test@test.com',
  auth0Id: 'auth-id',
  displayName: 'Test User',
  created: new Date(),
  questions: [],
  answers: [],
  votes: [],
} as User;
