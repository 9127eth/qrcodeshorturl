import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import QRCodeSVG from 'qrcode-svg';
import applyRateLimit from '../../lib/rateLimit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ error: 'Too Many Requests' });
  }

  if (req.method === 'POST') {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      // Generate PNG QR codes
      const qrCodeImage = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', scale: 20 });
      const qrCodeImageTransparent = await QRCode.toDataURL(url, { 
        errorCorrectionLevel: 'H', 
        scale: 20,
        color: { 
          dark: '#000000',
          light: '#00000000'  // Transparent background
        }
      });
      
      // Generate SVG QR codes
      const qrCodeSvg = new QRCodeSVG({
        content: url,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "H"
      });
      const svgQrCode = qrCodeSvg.svg();

      const qrCodeSvgTransparent = new QRCodeSVG({
        content: url,
        width: 256,
        height: 256,
        color: "#000000",
        background: "transparent",
        ecl: "H"
      });
      const svgQrCodeTransparent = qrCodeSvgTransparent.svg();

      res.status(200).json({ 
        qrCodeImage, 
        qrCodeImageTransparent, 
        svgQrCode, 
        svgQrCodeTransparent 
      });
    } catch {
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
