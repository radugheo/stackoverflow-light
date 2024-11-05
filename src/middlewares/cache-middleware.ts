import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const getCacheKey = (limit: number) => `questions:popular:${limit}`;

export const cachePopularQuestions = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = req.query.sortBy as string;

  if (page === 1 && sortBy === 'popular') {
    try {
      const cached = await redis.get(getCacheKey(limit));
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json;
      res.json = (body) => {
        redis.setex(getCacheKey(limit), 60, JSON.stringify(body)).catch((error) => {
          console.error('Redis cache error:', error);
        });
        return originalJson.call(res, body);
      };
    } catch (error) {
      return res.status(500).json({
        error: 'Cache retrieval failed',
      });
    }
  }
  next();
};

export const clearQuestionsCache = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const keys = await redis.keys('questions:popular:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: 'Cache invalidation failed',
    });
  }
};
