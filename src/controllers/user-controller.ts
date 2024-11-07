import { Response } from 'express';
import { UserService } from '../services/user-service';
import { AuthRequest } from '../types/request-types';
import { isError } from '../utils/helpers';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userService.findById(req.user!.id);
      res.json(user);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };
}
