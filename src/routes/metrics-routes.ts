import { Router } from 'express';
import { MetricsController } from '../controllers/metrics-controller';
import { MetricsService } from '../services/metrics-service';

const metricsService = new MetricsService();
const metricsController = new MetricsController(metricsService);

export const metricsRouter = Router();

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Get platform metrics
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Platform metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mostPopularDay:
 *                   type: string
 *                 averages:
 *                   type: object
 *                   properties:
 *                     questionsPerUser:
 *                       type: number
 *                     answersPerUser:
 *                       type: number
 *                     votesPerUser:
 *                       type: number
 *                 totals:
 *                   type: object
 *                   properties:
 *                     questions:
 *                       type: number
 *                     answers:
 *                       type: number
 *                     votes:
 *                       type: number
 *                     users:
 *                       type: number
 */
metricsRouter.get('/', metricsController.getMetrics);
