'use client';

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import validator from 'validator';
import Image from 'next/image';

const validateUrl = (value: string): string | null => {
  if (validator.isURL(value, { require_protocol: false })) {
    return null;
  } else {
    return "This doesn't look like a valid URL";
  }
};

export default function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [fileType, setFileType] = useState('png');
  const [copySuccess, setCopySuccess] = useState(false);
  const [svgQrCode, setSvgQrCode] = useState('');

  const handleGenerateQRCode = async () => {
    const validationError = validateUrl(url);
    if (validationError && !window.confirm(`${validationError}. Are you sure you want to continue?`)) {
      return;
    }

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
      setSvgQrCode(data.svgQrCode);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleShortenUrl = async () => {
    const validationError = validateUrl(url);
    if (validationError && !window.confirm(`${validationError}. Are you sure you want to continue?`)) {
      return;
    }

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

  const handleDownload = () => {
    const link = document.createElement('a');
    if (fileType === 'svg') {
      const blob = new Blob([svgQrCode], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
    } else {
      link.href = qrCode;
    }
    link.download = `qrcode.${fileType}`;
    link.click();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-0">
      <div className="space-y-2 mb-6">
        <Label htmlFor="url" className="text-lg font-semibold">Enter a URL</Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          validateUrl={validateUrl} // Pass the validateUrl function here
          className="text-base"
        />
      </div>
      <div className="flex space-x-2 mb-6">
        <Button onClick={handleGenerateQRCode} className="flex-1 text-base font-semibold">
          Get QR Code
        </Button>
        <Button onClick={handleShortenUrl} variant="outline" className="flex-1 text-base font-semibold">
          Get Short URL
        </Button>
      </div>
      {(qrCode || shortUrl) && (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          {qrCode && (
            <div className="mb-4 w-full flex flex-col sm:flex-row items-center justify-center">
              <div className="bg-gray-100 p-4 rounded-md">
                <Image src={qrCode} alt="QR Code" width={192} height={192} />
              </div>
              <div className="flex flex-col items-center mt-4 sm:mt-0 sm:ml-4">
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="mb-2 p-1 border rounded-md text-sm w-24"
                >
                  <option value="png">png</option>
                  <option value="jpeg">jpeg</option>
                  <option value="svg">svg</option>
                </select>
                <Button
                  variant="outline"
                  className="text-sm font-semibold"
                  onClick={handleDownload}
                >
                  Download
                </Button>
              </div>
            </div>
          )}
          {shortUrl && (
            <div className="mt-4 w-full">
              <h2 className="text-lg font-semibold mb-2">Shortened URL:</h2>
              <div className="flex items-center space-x-2">
                <Input value={shortUrl} readOnly className="text-base" />
                <Button 
                  onClick={handleCopy} 
                  className="text-sm font-semibold"
                  disabled={copySuccess}
                >
                  {copySuccess ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}