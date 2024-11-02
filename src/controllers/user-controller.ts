import { Response } from 'express';
import { UserService } from '../services/user-service';
import { AuthRequest } from '../types/request-types';

export class UserController {
  constructor(private userService: UserService) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await this.userService.findById(req.user!.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: (error as Error).message });
    }
  };
}
