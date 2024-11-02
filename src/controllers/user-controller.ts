import { Response } from 'express';
import { UserService } from '../services/user-service';
import { AuthRequest } from '../types/request-types';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('It got here');
      if (!req.user) {
        console.log('Not authenticated')
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const user = await this.userService.findById(req.user.id);
      console.log(`User ${JSON.stringify(user)}`);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
