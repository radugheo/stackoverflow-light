import { Repository } from 'typeorm';
import { User } from '../models/user-entity';
import { AppDataSource } from '../config/database-config';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  findOrCreateUser = async (userData: {
    auth0Id: string;
    email: string;
    displayName: string;
  }): Promise<User> => {
    let user = await this.userRepository.findOneBy({
      auth0Id: userData.auth0Id,
    });
    if (!user) {
      user = this.userRepository.create({
        auth0Id: userData.auth0Id,
        email: userData.email,
        displayName: userData.displayName,
      });
      await this.userRepository.save(user);
    }

    return user;
  };

  findById = async (id: string): Promise<User> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  };
}
