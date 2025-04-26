"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SessionInfoProps {
  sessionCode: string;
  joinUrl: string;
}

export default function SessionInfo({ sessionCode, joinUrl }: SessionInfoProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The join code has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8 text-center">
      <h2 className="text-xl font-semibold mb-3">Session Code</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-bold tracking-widest bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text p-2 border-2 border-white/10 rounded-lg">
          {sessionCode}
        </div>

        <button
          onClick={() => copyToClipboard(sessionCode)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "Copied!" : "Copy Code"}</span>
        </button>

        <p className="text-sm text-gray-400 mt-2">
          Share this code with others to join your game session
        </p>
      </div>
    </div>
  );
}