import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const generateShortCode = async (): Promise<string> => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortCode = '';
  for (let i = 0; i < 5; i++) {
    shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Ensure the short code is unique
  const q = query(collection(db, 'urls'), where('shortCode', '==', shortCode));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return generateShortCode();
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
    await addDoc(collection(db, 'urls'), { longUrl, shortCode });

    res.status(200).json({ shortUrl: `https://qrsu.co/${shortCode}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
