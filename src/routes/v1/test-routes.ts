/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import { redis } from '../../config/redis-config';

export const testRouter = Router();

testRouter.get('/cache', async (_, res) => {
  try {
    const keys = await redis.keys('questions:popular:*');
    const cacheData: Record<string, any> = {};

    for (const key of keys) {
      const value = await redis.get(key);
      cacheData[key] = value ? JSON.parse(value) : null;
    }

    res.json({
      keys,
      cacheData,
      ttl: await Promise.all(keys.map((key) => redis.ttl(key))),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache data' });
  }
});
