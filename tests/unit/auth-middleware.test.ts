import { Response, NextFunction } from 'express';
import { handleAuth } from '../../src/middlewares/auth-middleware';
import { AuthRequest } from '../../src/types/request-types';
import { UserService } from '../../src/services/user-service';
import { mockUser } from '../mocks/users';

describe('Auth Middleware', () => {
  let mockAuthRequest: Partial<AuthRequest>;
  let mockAuthResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    expect.hasAssertions();

    mockAuthRequest = {
      oidc: {
        isAuthenticated: jest.fn(),
        user: {
          sub: 'auth0|123',
          email: 'test@test.com',
          name: 'Test User',
        },
        fetchUserInfo: jest.fn(),
      },
    };
    mockAuthResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleAuth', () => {
    let mockUserService: Partial<UserService>;

    beforeEach(() => {
      mockUserService = {
        findOrCreateUser: jest.fn(),
      };
    });

    it('should attach user to request if authenticated', async () => {
      jest.spyOn(mockAuthRequest.oidc!, 'isAuthenticated').mockReturnValue(true);
      jest.spyOn(mockUserService, 'findOrCreateUser').mockResolvedValue(mockUser);

      await handleAuth(mockUserService as UserService)(
        mockAuthRequest as AuthRequest,
        mockAuthResponse as Response,
        nextFunction
      );

      expect(mockAuthRequest.user).toBe(mockUser);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should handle authentication failure', async () => {
      jest.spyOn(mockAuthRequest.oidc!, 'isAuthenticated').mockReturnValue(true);
      jest.spyOn(mockUserService, 'findOrCreateUser').mockRejectedValue(new Error());

      await handleAuth(mockUserService as UserService)(
        mockAuthRequest as AuthRequest,
        mockAuthResponse as Response,
        nextFunction
      );

      expect(mockAuthResponse.json).toHaveBeenCalledWith({ error: 'Authentication failed' });
    });
  });
});
