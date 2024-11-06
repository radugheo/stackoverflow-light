/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../src/config/database-config', () => {
  const actual = jest.requireActual('../../src/config/database-config');
  return {
    ...actual,
    AppDataSource: actual.TestDataSource,
  };
});

jest.mock('express-openid-connect', () => ({
  auth: () => (req: any, _res: any, next: any) => {
    req.oidc = {
      isAuthenticated: () => true,
      user: {
        sub: 'auth0|123',
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    next();
  },
}));

jest.mock('../../src/config/redis-config', () => {
  const mockRedis = {
    get: jest.fn().mockImplementation(() => Promise.resolve(null)),
    setex: jest.fn().mockImplementation(() => Promise.resolve('OK')),
    keys: jest.fn().mockImplementation(() => Promise.resolve([])),
    del: jest.fn().mockImplementation(() => Promise.resolve(1)),
    quit: jest.fn().mockImplementation(() => Promise.resolve('OK')),
  };

  return { redis: mockRedis };
});
