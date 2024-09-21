import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin';
import applyRateLimit from '../../lib/rateLimit';
import fetch from 'node-fetch';

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
  const encodedUrl = encodeURIComponent(url);
  const threatTypes = 'MALWARE,SOCIAL_ENGINEERING,UNWANTED_SOFTWARE';
  const apiKey = process.env.WEBRISK_API_KEY;

  const endpoint = `https://webrisk.googleapis.com/v1/uris:search?uri=${encodedUrl}&threatTypes=${threatTypes}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      console.error(`Web Risk API error: ${response.statusText}`);
      return false; // Treat as unsafe if API request fails
    }
    const data = await response.json();
    return !data.threat; // URL is safe if 'threat' is undefined
  } catch (error) {
    console.error('Error checking URL safety:', error);
    return false; // Treat as unsafe on error
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
