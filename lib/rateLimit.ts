import rateLimit from 'express-rate-limit';
import { NextApiRequest, NextApiResponse } from 'next';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Create a wrapper function to make it compatible with Next.js API routes
export default function applyRateLimit(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    limiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
