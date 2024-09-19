'use client';

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleGenerateQRCode = () => {
    console.log('Generating QR code for:', url);
    setQrCode('QR code placeholder');
  };

  const handleShortenUrl = () => {
    const fakeShortUrl = 'https://short.ly/' + Math.random().toString(36).substr(2, 5);
    setShortUrl(fakeShortUrl);
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
        <div className="bg-white rounded-lg shadow-md p-6">
          {qrCode && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">QR Code:</h2>
              <div className="bg-gray-100 p-4 rounded-md">{qrCode}</div>
              <Button variant="outline" className="mt-2 text-base font-semibold">Download</Button>
            </div>
          )}
          {shortUrl && (
            <div>
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