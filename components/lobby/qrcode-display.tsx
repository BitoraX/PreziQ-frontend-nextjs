"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  joinUrl: string;
}

export default function QRCodeDisplay({ joinUrl }: QRCodeDisplayProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(joinUrl, {
          width: 250,
          margin: 1,
          color: {
            dark: '#ffffff',
            light: '#00000000', // Transparent background
          },
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [joinUrl]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my PreziQ game session!',
          text: 'Scan this QR code or use the code to join my presentation game.',
          url: joinUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(joinUrl);
      alert('Join link copied to clipboard!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-xl p-6 backdrop-blur-sm border border-white/10">
      <h3 className="text-lg font-medium mb-4 text-center">Scan to Join</h3>
      <div className="flex flex-col items-center justify-center">
        {qrCodeDataUrl ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
            <div className="p-4 bg-black/50 rounded-xl relative">
              <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
              <div className="absolute inset-0 opacity-30 animate-pulse bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 bg-gray-800 rounded-lg animate-pulse"></div>
        )}

        <Button
          variant="outline"
          className="mt-4 px-6 border-white/20 text-white hover:bg-white/10"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Link
        </Button>
      </div>
    </div>
  );
}