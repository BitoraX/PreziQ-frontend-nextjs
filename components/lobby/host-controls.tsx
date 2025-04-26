"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, AlertTriangle, Users } from "lucide-react";

interface HostControlsProps {
  onStartSession: () => void;
  canStart: boolean;
  playerCount: number;
}

export default function HostControls({ onStartSession, canStart, playerCount }: HostControlsProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    if (!canStart) return;

    setIsStarting(true);
    // Simulate some loading time before starting
    setTimeout(() => {
      onStartSession();
    }, 1500);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Host Controls</h3>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4" />
          <span>{playerCount} player{playerCount !== 1 ? 's' : ''} connected</span>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        {!canStart && (
          <div className="flex items-center gap-2 text-yellow-400 text-sm mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Waiting for all players to be ready</span>
          </div>
        )}

        <Button
          className="w-full py-6 text-lg font-medium relative overflow-hidden group"
          variant={canStart ? "default" : "outline"}
          disabled={!canStart || isStarting}
          onClick={handleStart}
        >
          {isStarting ? (
            <>
              <span className="animate-pulse">Starting game...</span>
              <div className="absolute bottom-0 left-0 h-1 bg-primary animate-[loading_1.5s_ease-in-out]"></div>
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Start Game Session
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-400 mt-3">
          Starting the game will bring all players to the presentation view
        </p>
      </div>
    </div>
  );
}