"use client";

import SplashCursor from "@/components/clement-kit-ui/splash-cursor";
import ChatPanel from "@/components/lobby/chat-panel";
import HostControls from "@/components/lobby/host-controls";
import LobbyContainer from "@/components/lobby/lobby-container";
import PlayersList from "@/components/lobby/players-list";
import QRCodeDisplay from "@/components/lobby/qrcode-display";
import SessionInfo from "@/components/lobby/session-info";
import WaitingAnimation from "@/components/lobby/waiting-animation";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
}

export default function LobbyClient() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessionCode, setSessionCode] = useState(sessionId.substring(0, 6).toUpperCase());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would connect to your backend
    // Mock data for demonstration
    setIsHost(true); // For testing, set current user as host
    setPlayers([
      { id: '1', name: 'Host User', avatar: 'https://png.pngtree.com/png-clipart/20210225/ourlarge/pngtree-cute-cartoon-character-avatar-wearing-glasses-png-image_2940625.jpg', isHost: true, isReady: true },
      { id: '2', name: 'Player 2', avatar: 'https://img.lovepik.com/free-png/20211129/lovepik-girl-cartoon-hand-drawn-cute-illustration-avatar-png-image_401193454_wh1200.png', isHost: false, isReady: true },
      { id: '3', name: 'Player 3', avatar: 'https://img.lovepik.com/free-png/20211209/lovepik-cute-girl-avatar-png-image_401442511_wh1200.png', isHost: false, isReady: false },
    ]);
    setIsLoading(false);

    // You would add your socket or API connection here
    // to listen for new players joining
  }, [sessionId]);

  const handleStartSession = () => {
    // Navigate to the presentation when host starts
    router.push(`/presentation/${sessionId}`);
  };

  const joinUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${sessionCode}`;

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-black text-white">
      {/* Background effect */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={512}
        DENSITY_DISSIPATION={9}
        VELOCITY_DISSIPATION={5}
        PRESSURE={0.25}
        PRESSURE_ITERATIONS={15}
        CURL={8}
        SPLAT_RADIUS={0.1}
        SPLAT_FORCE={2500}
        SHADING={true}
        COLOR_UPDATE_SPEED={6}
        BACK_COLOR={{ r: 0, g: 0, b: 0 }}
        TRANSPARENT={true}
      />

      <LobbyContainer isLoading={isLoading}>
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4">
          <div className="flex-1">
            <SessionInfo
              sessionCode={sessionCode}
              joinUrl={joinUrl}
            />
            <PlayersList players={players} />
            {isHost && (
              <HostControls
                onStartSession={handleStartSession}
                canStart={players.every(p => p.isReady)}
                playerCount={players.length}
              />
            )}
          </div>

          <div className="lg:w-1/3 flex flex-col gap-6">
            <QRCodeDisplay joinUrl={joinUrl} />
            <WaitingAnimation />
            <ChatPanel sessionId={sessionId} />
          </div>
        </div>
      </LobbyContainer>
    </main>
  );
}