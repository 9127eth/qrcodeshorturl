import type { NextApiRequest, NextApiResponse } from 'next';
import { randomBytes } from 'node:crypto';
import { db } from '../../lib/firebaseAdmin';
import applyRateLimit from '../../lib/rateLimit';
import { SHORT_CODE_LENGTH } from '../../lib/shortCode';
import { checkUrlSafety, normalizeHttpUrl } from '../../lib/webRisk';

const MAX_CODE_ATTEMPTS = 5;
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateShortCode(): string {
  const bytes = randomBytes(SHORT_CODE_LENGTH);
  return Array.from(bytes, (byte) => CHARACTERS[byte % CHARACTERS.length]).join('');
}

function isAlreadyExists(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) return false;
  const code = (error as { code: unknown }).code;
  return code === 6 || code === 'already-exists';
}

async function createShortUrl(longUrl: string): Promise<string> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt += 1) {
    const shortCode = generateShortCode();

    try {
      await db.collection('urls').doc(shortCode).create({
        longUrl,
        createdAt: new Date().toISOString(),
        isSafe: true,
      });
      return shortCode;
    } catch (error) {
      if (!isAlreadyExists(error)) throw error;
    }
  }

  throw new Error('Unable to allocate a unique short code.');
}

export const config = {
  api: { bodyParser: { sizeLimit: '4kb' } },
  maxDuration: 10,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  const longUrl =
    req.body && typeof req.body === 'object' && 'longUrl' in req.body
      ? req.body.longUrl
      : undefined;

  if (typeof longUrl !== 'string' || !longUrl.trim() || longUrl.length > 2_048) {
    return res.status(400).json({ error: 'A valid URL is required' });
  }

  const normalizedUrl = normalizeHttpUrl(longUrl.trim());
  if (!normalizedUrl) {
    return res.status(400).json({ error: 'A valid HTTP or HTTPS URL is required' });
  }

  const isSafe = await checkUrlSafety(normalizedUrl);
  if (!isSafe) {
    return res.status(400).json({ isSafe: false, error: 'The URL could not be verified as safe.' });
  }

  try {
    const shortCode = await createShortUrl(normalizedUrl);
    const domain = process.env.NEXT_PUBLIC_DOMAIN?.replace(/\/$/, '');

    if (!domain) throw new Error('NEXT_PUBLIC_DOMAIN is not configured.');

    return res.status(200).json({ isSafe: true, shortUrl: `${domain}/${shortCode}` });
  } catch (error) {
    console.error('Failed to create short URL:', error);
    return res.status(500).json({ error: 'Failed to create short URL' });
  }
}
