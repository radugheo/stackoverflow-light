import { Router } from 'express';
import { metricsController } from '../../config/dependencies';

export const metricsRouter = Router();

metricsRouter.get('/', metricsController.getMetrics);
