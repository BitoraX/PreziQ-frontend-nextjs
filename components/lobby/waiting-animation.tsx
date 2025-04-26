"use client";

export default function WaitingAnimation() {
  return (
    <div className="rounded-xl p-6 bg-black/30 backdrop-blur-sm border border-white/10 flex flex-col items-center">
      <div className="flex items-center space-x-2 justify-center mb-4">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
        <h3 className="text-lg font-medium">Waiting for players...</h3>
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {[0, 1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        The game will start when the host is ready and all players have joined
      </p>
    </div>
  );
}