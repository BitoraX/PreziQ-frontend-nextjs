"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, CheckCircle2, Circle } from "lucide-react";

interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
}

interface PlayersListProps {
  players: Player[];
}

export default function PlayersList({ players }: PlayersListProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Players ({players.length})</h2>
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white/20">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback>{player.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && (
                    <Crown className="h-4 w-4 text-yellow-400" fill="currentColor" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={player.isReady ? "default" : "outline"} className="flex items-center">
                {player.isReady ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-400" />
                    Ready
                  </>
                ) : (
                  <>
                    <Circle className="h-3.5 w-3.5 mr-1" />
                    Waiting
                  </>
                )}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}