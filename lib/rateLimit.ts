import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientIp,
  validate: { xForwardedForHeader: false },
});

// Create a wrapper function to make it compatible with Next.js API routes
export default function applyRateLimit(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    // @ts-expect-error: LRUCache types are not fully compatible
    limiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
