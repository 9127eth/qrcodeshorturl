'use client';

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleGenerateQRCode = async () => {
    try {
      const response = await fetch('/api/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      setQrCode(data.qrCodeImage);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleShortenUrl = async () => {
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: url }),
      });

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error('Failed to shorten URL:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2 mb-6">
        <Label htmlFor="url" className="text-lg font-semibold">Enter a URL</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="text-base"
        />
      </div>
      <div className="flex space-x-2 mb-6">
        <Button onClick={handleGenerateQRCode} className="flex-1 text-base font-semibold">
          Generate QR Code
        </Button>
        <Button onClick={handleShortenUrl} variant="outline" className="flex-1 text-base font-semibold">
          Shorten URL
        </Button>
      </div>
      {(qrCode || shortUrl) && (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          {qrCode && (
            <div className="mb-4 w-full flex items-start">
              <h2 className="text-lg font-semibold mb-2 mr-4">QR Code:</h2> {/* Added margin-right */}
              <div className="bg-gray-100 p-4 rounded-md">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <Button
                variant="outline"
                className="mt-2 text-base font-semibold"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = qrCode;
                  link.download = 'qrcode.png';
                  link.click();
                }}
              >
                Download
              </Button>
            </div>
          )}
          {shortUrl && (
            <div className="mt-4 w-full">
              <h2 className="text-lg font-semibold mb-2">Shortened URL:</h2>
              <div className="flex items-center space-x-2">
                <Input value={shortUrl} readOnly className="text-base" />
                <Button onClick={() => navigator.clipboard.writeText(shortUrl)} className="text-base font-semibold">Copy</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}