import { Request, Response } from 'express';
import { AnswerService } from '../services/answer-service';
import { AuthRequest } from '../types/request-types';
import { CreateAnswerDto, UpdateAnswerDto } from '../types/answer-types';

export class AnswerController {
  constructor(private answerService: AnswerService) {}

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const answers = await this.answerService.findAll(req.params.questionId);
      res.json(answers);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const createAnswerDto: CreateAnswerDto = {
        ...req.body,
        questionId: req.params.questionId,
        authorId: req.user!.id,
      };
      const answer = await this.answerService.create(createAnswerDto);
      res.status(200).json(answer);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const updateAnswerDto: UpdateAnswerDto = req.body;
      const answer = await this.answerService.update(req.params.id, req.user!.id, updateAnswerDto);
      res.json(answer);
    } catch (error) {
      res.status(403).json({ error: (error as Error).message });
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.answerService.delete(req.params.id, req.user!.id);
      res.status(200).json({ message: 'Delete was successful' });
    } catch (error) {
      res.status(403).json({ error: (error as Error).message });
    }
  };
}