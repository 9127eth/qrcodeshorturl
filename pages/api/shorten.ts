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
    // Generate a 5-character random string
    shortCode = Array.from({ length: 5 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');

    // Check if the shortCode already exists
    const docRef = db.collection('urls').doc(shortCode);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      break; // Unique shortCode found
    }
  }

  return shortCode;
};

const checkUrlSafety = async (url: string): Promise<boolean> => {
  const threatTypes = ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'];
  const apiKey = process.env.WEBRISK_API_KEY;

  if (!apiKey) {
    console.error('WEBRISK_API_KEY is not set in the environment variables.');
    return false; // Assume unsafe if API key is missing
  }

  const params = new URLSearchParams({
    key: apiKey,
    uri: url,
  });

  threatTypes.forEach((type) => params.append('threatTypes', type));

  const endpoint = `https://webrisk.googleapis.com/v1/uris:search?${params.toString()}`;

  try {
    console.log('Sending request to Web Risk API:', endpoint);

    const response = await fetch(endpoint, {
      method: 'GET',
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));

    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (!response.ok) {
      console.error(`Web Risk API error: ${response.status} ${response.statusText}`);
      console.error('Error details:', responseText);
      return false; // Assume unsafe on API error
    }

    const data = JSON.parse(responseText) as WebRiskResponse;
    console.log('Parsed response:', JSON.stringify(data, null, 2));

    if (data.threat) {
      console.log('Threat detected:', data.threat.threatTypes);
      return false; // URL is unsafe
    }

    return true; // URL is safe
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false; // Assume unsafe on error
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

    // Check if the URL is safe
    const isSafe = await checkUrlSafety(longUrl);
    if (!isSafe) {
      return res.status(400).json({ error: 'The URL provided is unsafe.' });
    }

    const shortCode = await generateShortCode();
    console.log(`Generated short code: ${shortCode}`);

    // Store additional information for auditing purposes
    await db.collection('urls').doc(shortCode).set({
      longUrl,
      createdAt: new Date().toISOString(),
    });

    console.log(`Stored URL mapping: ${shortCode} -> ${longUrl}`);

    const shortUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;
    console.log(`Created short URL: ${shortUrl}`);

    res.status(200).json({ shortUrl });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
