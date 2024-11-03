import { Response } from 'express';
import { MetricsService } from '../services/metrics-service';
import { AuthRequest } from '../types/request-types';

export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  getMetrics = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const metrics = await this.metricsService.getMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };
}
