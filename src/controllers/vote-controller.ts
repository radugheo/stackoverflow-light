import { Response } from 'express';
import { VoteService } from '../services/vote-service';
import { AuthRequest } from '../types/request-types';
import { isError } from '../utils/helpers';

export class VoteController {
  constructor(private voteService: VoteService) {}

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vote = await this.voteService.create({
        userId: req.user!.id,
        value: req.body.value,
        questionId: req.body.questionId,
        answerId: req.body.answerId,
      });

      res.status(200).json(vote);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.voteService.delete(req.params.id, req.user!.id);
      res.status(200).send({ message: 'Delete was successful' });
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  getUserVote = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vote = await this.voteService.findUserVote(
        req.user!.id,
        req.query.questionId as string,
        req.query.answerId as string
      );

      res.json(vote);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };
}
