import { UserService } from '../../src/services/user-service';
import { User } from '../../src/models/user-entity';
import { AppDataSource } from '../../src/config/database-config';
import { mockUser } from '../mocks/users';
import { Repository } from 'typeorm';

describe('User Service', () => {
  let userService: UserService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(() => {
    expect.hasAssertions();

    mockUserRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jest
      .spyOn(AppDataSource, 'getRepository')
      .mockImplementation(() => mockUserRepository as Repository<User>);

    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    const userData = {
      auth0Id: 'auth0-123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    it('should return existing user if found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await userService.findOrCreateUser(userData);

      expect(result).toEqual(mockUser);
    });

    it('should create and return new user if not found', async () => {
      const newUser = { ...mockUser, ...userData };

      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(mockUserRepository, 'create').mockReturnValue(newUser);
      jest.spyOn(mockUserRepository, 'save').mockResolvedValue(newUser);

      const result = await userService.findOrCreateUser(userData);

      expect(result).toEqual(newUser);
    });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await userService.findById('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOneBy').mockResolvedValue(null);

      await expect(userService.findById('999')).rejects.toThrow('User not found');
    });
  });
});
