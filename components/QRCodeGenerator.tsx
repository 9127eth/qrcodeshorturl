"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import validator from "validator";
import Image from "next/image";
import QRCode from "qrcode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const validateUrl = (value: string): string | null => {
  if (validator.isURL(value, { require_protocol: false })) {
    return null;
  }
  return "This doesn't look like a valid URL";
};

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrCodeTarget, setQrCodeTarget] = useState("");
  const [fileType, setFileType] = useState("png");
  const [isTransparent, setIsTransparent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!qrCodeTarget) {
      setQrCode("");
      return;
    }

    let cancelled = false;

    QRCode.toDataURL(qrCodeTarget, {
      errorCorrectionLevel: "H",
      width: 384,
      margin: 4,
      color: {
        dark: "#000000",
        light: isTransparent ? "#00000000" : "#FFFFFFFF",
      },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrCode(dataUrl);
      })
      .catch((error) => {
        console.error("Failed to generate QR code:", error);
        if (!cancelled) setErrorMessage("An error occurred while generating the QR code.");
      });

    return () => {
      cancelled = true;
    };
  }, [qrCodeTarget, isTransparent]);

  const handleGenerateQRCode = () => {
    setErrorMessage("");
    const targetUrl = url.trim();
    if (!targetUrl) {
      setErrorMessage("Please add a valid URL");
      return;
    }
    const validationError = validateUrl(targetUrl);
    if (validationError && !window.confirm(`${validationError}. Are you sure you want to continue?`)) {
      return;
    }
    setQrCodeTarget(targetUrl);
  };

  const handleDownload = async () => {
    if (!qrCodeTarget) return;

    const link = document.createElement("a");
    let objectUrl: string | undefined;

    try {
      if (fileType === "svg") {
        const svgContent = await QRCode.toString(qrCodeTarget, {
          type: "svg",
          errorCorrectionLevel: "H",
          width: 1024,
          margin: 4,
          color: {
            dark: "#000000",
            light: isTransparent ? "#00000000" : "#FFFFFFFF",
          },
        });
        objectUrl = URL.createObjectURL(new Blob([svgContent], { type: "image/svg+xml" }));
        link.href = objectUrl;
      } else {
        link.href = await QRCode.toDataURL(qrCodeTarget, {
          type: fileType === "jpeg" ? "image/jpeg" : "image/png",
          errorCorrectionLevel: "H",
          width: 1024,
          margin: 4,
          color: {
            dark: "#000000",
            light: isTransparent ? "#00000000" : "#FFFFFFFF",
          },
          rendererOpts: fileType === "jpeg" ? { quality: 0.92 } : undefined,
        });
      }
      link.download = `qrcode${isTransparent ? "_transparent" : ""}.${fileType}`;
      link.click();
    } catch (error) {
      console.error("Failed to download QR code:", error);
      setErrorMessage("An error occurred while preparing the download.");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  };

  const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGenerateQRCode();
    }
  };

  const handleClear = () => {
    setQrCode("");
    setQrCodeTarget("");
    setUrl("");
    setErrorMessage("");
  };

  return (
    <div>
      <div className="mb-4 space-y-2 text-left">
        <Label htmlFor="url" className="text-base font-semibold">
          Enter a URL
        </Label>
        <Input
          id="url"
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={handleEnterPress}
          validateUrl={validateUrl}
          className="text-base"
        />
      </div>
      <Button onClick={handleGenerateQRCode} className="w-full text-base font-semibold sm:w-auto">
        Get QR code
      </Button>
      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>{errorMessage}</span>
        </div>
      )}
      {qrCode && (
        <div className="mt-6 rounded-xl border bg-card p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <div className="rounded-md bg-white p-4">
              <Image src={qrCode} alt="QR code" width={192} height={192} unoptimized />
            </div>
            <div className="flex flex-col items-center gap-4">
              <select
                value={fileType}
                aria-label="Download format"
                onChange={(event) => {
                  setFileType(event.target.value);
                  if (event.target.value === "jpeg") setIsTransparent(false);
                }}
                className="h-10 w-28 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="png">png</option>
                <option value="jpeg">jpeg</option>
                <option value="svg">svg</option>
              </select>
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={isTransparent}
                  disabled={fileType === "jpeg"}
                  onChange={(event) => setIsTransparent(event.target.checked)}
                  className="mr-2"
                />
                no background
              </label>
              <Button variant="outline" className="text-sm font-semibold" onClick={handleDownload}>
                Download
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <button type="button" className="text-sm text-primary hover:underline" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
