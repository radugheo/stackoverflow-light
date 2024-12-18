import { Request, Response } from 'express';
import { QuestionService } from '../services/question-service';
import { AuthRequest } from '../types/request-types';
import { CreateQuestionDto, UpdateQuestionDto } from '../types/question-types';
import { isError } from '../utils/helpers';

export class QuestionController {
  constructor(private questionService: QuestionService) {}

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as 'newest' | 'popular') || 'popular';

      const result = await this.questionService.findAll({
        page,
        limit,
        sortBy,
      });
      res.json(result);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const question = await this.questionService.findOne(req.params.id);
      res.json(question);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  create = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const createQuestionDto: CreateQuestionDto = {
        ...req.body,
        authorId: req.user!.id,
      };

      const question = await this.questionService.create(createQuestionDto);
      res.status(200).json(question);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  update = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const updateQuestionDto: UpdateQuestionDto = req.body;
      const question = await this.questionService.update(
        req.params.id,
        req.user!.id,
        updateQuestionDto
      );
      res.json(question);
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };

  delete = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await this.questionService.delete(req.params.id, req.user!.id);
      res.status(200).json({ message: 'Delete was successful' });
    } catch (error: unknown) {
      if (isError(error)) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  };
}
