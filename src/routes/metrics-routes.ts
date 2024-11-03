import { Router } from 'express';
import { metricsController } from '../config/dependencies';

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
