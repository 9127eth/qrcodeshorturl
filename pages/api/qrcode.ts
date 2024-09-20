import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import applyRateLimit from '../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyRateLimit(req, res);
  } catch (error) {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      const qrCodeImage = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', scale: 20 });
      res.status(200).json({ qrCodeImage });
    } catch {
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
