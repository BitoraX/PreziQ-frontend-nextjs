"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Zap, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Player {
    id: number
    name: string
    avatar: string
    score: number
    streak: number
}

interface LiveLeaderboardProps {
    players: Player[]
}

export default function LiveLeaderboard({ players }: LiveLeaderboardProps) {
    const [animateIndex, setAnimateIndex] = useState<number | null>(null)
    const [prevPlayers, setPrevPlayers] = useState<Player[]>([])
    const maxScore = players.length > 0 ? Math.max(...players.map((p) => p.score)) : 0

    // Track score changes to trigger animations
    useEffect(() => {
        if (prevPlayers.length === 0) {
            setPrevPlayers(players)
            return
        }

        // Find which player's score changed
        const changedIndex = players.findIndex((player, i) => {
            return prevPlayers[i] && prevPlayers[i].score !== player.score
        })

        if (changedIndex !== -1) {
            setAnimateIndex(changedIndex)
            setTimeout(() => setAnimateIndex(null), 1000)
            setPrevPlayers(players)
        }
    }, [players, prevPlayers])

    return (
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 dark:from-slate-800/80 dark:to-slate-900/80 light:from-white/80 light:to-slate-100/80 border-none shadow-xl overflow-hidden backdrop-blur-sm shadow-glow-sm">
            <CardHeader className="pb-2 border-b border-white/10 dark:border-white/10 light:border-black/10 bg-gradient-to-r from-purple-500/20 to-transparent dark:from-purple-500/20 light:from-purple-500/10">
                <CardTitle className="text-xl text-foreground flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <span className="drop-shadow-glow">Live Leaderboard</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <AnimatePresence>
                    {players.map((player, index) => (
                        <motion.div
                            key={player.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "relative",
                                index === 0
                                    ? "bg-gradient-to-r from-yellow-500/20 dark:from-yellow-500/20 light:from-yellow-500/10 to-transparent"
                                    : "",
                            )}
                        >
                            <div
                                className={cn(
                                    "flex items-center gap-3 p-4 border-b border-white/5 dark:border-white/5 light:border-black/5 relative overflow-hidden",
                                    animateIndex === index ? "bg-green-500/20 dark:bg-green-500/20 light:bg-green-500/10" : "",
                                )}
                            >
                                {/* Position indicator */}
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full shadow-lg shadow-black/20 text-white font-bold text-sm",
                                        index === 0
                                            ? "bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-glow-yellow"
                                            : index === 1
                                                ? "bg-gradient-to-br from-slate-300 to-slate-500"
                                                : index === 2
                                                    ? "bg-gradient-to-br from-amber-500 to-amber-800 shadow-glow-amber"
                                                    : "bg-gradient-to-br from-purple-500 to-indigo-600",
                                    )}
                                >
                                    {index === 0 ? <Trophy className="h-5 w-5" /> : index + 1}
                                </div>

                                {/* Avatar */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className={cn(
                                        "flex items-center justify-center w-12 h-12 rounded-full text-white text-2xl shadow-lg",
                                        index === 0
                                            ? "bg-gradient-to-br from-yellow-300 to-yellow-600 border-2 border-yellow-200/50 shadow-glow-yellow"
                                            : index === 1
                                                ? "bg-gradient-to-br from-slate-300 to-slate-500 border-2 border-white/30"
                                                : index === 2
                                                    ? "bg-gradient-to-br from-amber-500 to-amber-800 border-2 border-amber-400/30 shadow-glow-amber"
                                                    : "bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-purple-400/30",
                                    )}
                                >
                                    {player.avatar}
                                </motion.div>

                                {/* Player info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-foreground drop-shadow-glow">{player.name}</span>
                                            {index < 3 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5, type: "spring" }}
                                                >
                                                    {index === 0 ? (
                                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 shadow-glow-yellow">1st</Badge>
                                                    ) : index === 1 ? (
                                                        <Badge className="bg-slate-400 hover:bg-slate-500">2nd</Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-600 hover:bg-amber-700 shadow-glow-amber">3rd</Badge>
                                                    )}
                                                </motion.div>
                                            )}
                                        </div>
                                        <motion.div
                                            key={`score-${player.id}-${player.score}`}
                                            initial={{ scale: animateIndex === index ? 1.5 : 1, color: "#22c55e" }}
                                            animate={{ scale: 1, color: "#ffffff" }}
                                            transition={{ duration: 0.5 }}
                                            className="font-bold text-xl text-foreground drop-shadow-glow"
                                        >
                                            {player.score.toLocaleString()}
                                        </motion.div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="relative h-2.5 w-full rounded-full overflow-hidden bg-slate-700/50 dark:bg-slate-700/50 light:bg-slate-300/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${maxScore ? (player.score / maxScore) * 100 : 0}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className={cn(
                                                "absolute top-0 left-0 h-full",
                                                index === 0
                                                    ? "bg-gradient-to-r from-yellow-300 to-yellow-600 shadow-glow-yellow"
                                                    : index === 1
                                                        ? "bg-gradient-to-r from-slate-300 to-slate-500"
                                                        : index === 2
                                                            ? "bg-gradient-to-r from-amber-500 to-amber-800"
                                                            : "bg-gradient-to-r from-purple-500 to-indigo-600",
                                            )}
                                        />

                                        {/* Sparkles on the progress bar */}
                                        {index === 0 && (
                                            <div className="absolute top-0 right-0 h-full w-4 bg-white/30 animate-shimmer"></div>
                                        )}
                                    </div>
                                </div>

                                {/* Streak indicator */}
                                {player.streak > 1 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                        className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-glow-orange"
                                    >
                                        <Flame className="h-3 w-3 animate-pulse" />
                                        <span>{player.streak}</span>
                                    </motion.div>
                                )}

                                {/* Animation overlay */}
                                {animateIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0.5 }}
                                        animate={{ opacity: 0 }}
                                        transition={{ duration: 1 }}
                                        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-500/10"
                                    />
                                )}

                                {/* Stars animation for top player */}
                                {index === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}

