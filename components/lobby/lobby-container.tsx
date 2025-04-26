"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LobbyContainerProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export default function LobbyContainer({ children, isLoading }: LobbyContainerProps) {
  return (
    <div className="container relative z-10 mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xl font-medium animate-pulse">Loading game lobby...</p>
        </div>
      ) : (
        <div className="w-full backdrop-blur-md bg-black/30 rounded-2xl border border-white/10 shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Game Lobby
          </h1>
          {children}
        </div>
      )}
    </div>
  );
}