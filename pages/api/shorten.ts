import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseAdmin';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const shortCode = await generateShortCode();
    console.log(`Generated short code: ${shortCode}`);

    // Store the longUrl with shortCode as the document ID
    await db.collection('urls').doc(shortCode).set({ longUrl });
    console.log(`Stored URL mapping: ${shortCode} -> ${longUrl}`);

    const shortUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/${shortCode}`;
    console.log(`Created short URL: ${shortUrl}`);

    res.status(200).json({ shortUrl });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
