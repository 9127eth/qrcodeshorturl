import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin';
import applyRateLimit from '../../lib/rateLimit';
import fetch from 'node-fetch';

interface WebRiskResponse {
  threat?: {
    threatTypes: string[];
  };
}

const generateShortCode = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';

  while (true) {
    shortCode = Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    const docRef = db.collection('urls').doc(shortCode);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      break;
    }
  }

  return shortCode;
};

export const checkUrlSafety = async (url: string): Promise<boolean> => {
  const threatTypes = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];
  const apiKey = process.env.WEBRISK_API_KEY;

  if (!apiKey) {
    console.error('WEBRISK_API_KEY is not set in the environment variables.');
    return false;
  }

  const params = new URLSearchParams({
    key: apiKey,
    uri: url,
  });

  threatTypes.forEach((type) => params.append('threatTypes', type));

  const endpoint = `https://webrisk.googleapis.com/v1/uris:search?${params.toString()}`;

  try {
    const response = await fetch(endpoint, { method: 'GET' });
    const data = await response.json() as WebRiskResponse;

    if (data.threat) {
      console.log('Threat detected:', data.threat.threatTypes);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  if (req.method === 'POST') {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const isSafe = await checkUrlSafety(longUrl);
    if (!isSafe) {
      return res.status(200).json({ isSafe: false, error: 'The URL provided is unsafe.' });
    }

    const shortCode = await generateShortCode();
    console.log(`Generated short code: ${shortCode}`);

    await db.collection('urls').doc(shortCode).set({
      longUrl,
      createdAt: new Date().toISOString(),
      isSafe: true,
    });

    console.log(`Stored URL mapping: ${shortCode} -> ${longUrl}`);

    const shortUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;
    console.log(`Created short URL: ${shortUrl}`);

    res.status(200).json({ isSafe: true, shortUrl });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
