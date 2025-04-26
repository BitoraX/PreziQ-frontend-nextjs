"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, Home, Crown, Target, Flame, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Leaderboard() {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    })
    const [showConfetti, setShowConfetti] = useState(true)
    const [players] = useState([
        { id: 1, name: "Player 2", avatar: "🤠", score: 3850, correctAnswers: 5, streak: 3 },
        { id: 2, name: "Player 5", avatar: "😊", score: 3200, correctAnswers: 4, streak: 2 },
        { id: 3, name: "Player 1", avatar: "😎", score: 2700, correctAnswers: 4, streak: 2 },
        { id: 4, name: "Player 3", avatar: "🧐", score: 1950, correctAnswers: 3, streak: 1 },
        { id: 5, name: "Player 4", avatar: "🤓", score: 1500, correctAnswers: 2, streak: 1 },
    ])

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener("resize", handleResize)

        // Stop confetti after 8 seconds
        const timer = setTimeout(() => {
            setShowConfetti(false)
        }, 8000)

        return () => {
            window.removeEventListener("resize", handleResize)
            clearTimeout(timer)
        }
    }, [])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br bg p-4 md:p-8 overflow-hidden">
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={true}
                    numberOfPieces={200}
                    gravity={0.15}
                />
            )}

            <div className="max-w-5xl mx-auto relative">
                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                {/* <div className="flex justify-between items-center mb-8 relative z-10">
                    <Link href="/">
                        <Button
                            variant="outline"
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm shadow-glow-sm"
                        >
                            <Home className="mr-2 h-4 w-4" /> Home
                        </Button>
                    </Link>
                    <motion.h1
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 10,
                        }}
                        className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-glow"
                    >
                        Final Leaderboard
                    </motion.h1>
                </div> */}

                {/* New Podium Design */}
                <div className="mb-16 relative">
                    {/* Sparkles */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10"
                    >
                        <Sparkles className="h-12 w-12 text-yellow-300 animate-pulse" />
                    </motion.div>

                    <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 h-[320px] md:h-[300px] relative">
                        {/* Second Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
                            className="w-full md:w-1/3 h-[220px] relative"
                        >
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="flex flex-col items-center">
                                    <Medal className="h-10 w-10 text-slate-300 mb-2 drop-shadow-glow" />
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-4xl shadow-xl border-4 border-white/30 shadow-glow"
                                    >
                                        {players[1].avatar}
                                    </motion.div>
                                    <div className="mt-3 text-center">
                                        <p className="font-bold text-white text-lg drop-shadow-glow">{players[1].name}</p>
                                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 drop-shadow-glow">
                                            {players[1].score.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "120px" }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-700 to-slate-500 rounded-t-lg shadow-xl border-t-4 border-slate-300/30"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat-x bg-contain opacity-5"></div>
                            </motion.div>
                        </motion.div>

                        {/* First Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
                            className="w-full md:w-1/3 h-[260px] relative z-20"
                        >
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="flex flex-col items-center">
                                    <Crown className="h-12 w-12 text-yellow-400 mb-2 animate-bounce-slow drop-shadow-glow" />
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center text-5xl shadow-xl border-4 border-yellow-200/50 shadow-glow-yellow"
                                    >
                                        {players[0].avatar}
                                    </motion.div>
                                    <div className="mt-3 text-center">
                                        <p className="font-bold text-white text-xl drop-shadow-glow">{players[0].name}</p>
                                        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-glow">
                                            {players[0].score.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "160px" }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-700 to-yellow-500 rounded-t-lg shadow-xl border-t-4 border-yellow-300/30"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat-x bg-contain opacity-5"></div>
                            </motion.div>
                        </motion.div>

                        {/* Third Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
                            className="w-full md:w-1/3 h-[200px] relative"
                        >
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="flex flex-col items-center">
                                    <Award className="h-10 w-10 text-amber-600 mb-2 drop-shadow-glow" />
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className="w-22 h-22 rounded-full bg-gradient-to-br from-amber-500 to-amber-800 flex items-center justify-center text-3xl shadow-xl border-4 border-amber-500/30 shadow-glow-amber"
                                        style={{ width: "5.5rem", height: "5.5rem" }}
                                    >
                                        {players[2].avatar}
                                    </motion.div>
                                    <div className="mt-3 text-center">
                                        <p className="font-bold text-white text-lg drop-shadow-glow">{players[2].name}</p>
                                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-glow">
                                            {players[2].score.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "100px" }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg shadow-xl border-t-4 border-amber-500/30"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat-x bg-contain opacity-5"></div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Podium Base */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="h-8 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-lg shadow-xl origin-bottom"
                    >
                        <div className="w-full h-full bg-[url('/placeholder.svg?height=20&width=100')] bg-repeat-x bg-contain opacity-5"></div>
                    </motion.div>
                </div>

                {/* Leaderboard Tabs */}
                <Tabs defaultValue="points" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/10 p-1 rounded-xl backdrop-blur-sm shadow-glow-sm">
                        <TabsTrigger
                            value="points"
                            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-white/70 rounded-lg data-[state=active]:shadow-glow-sm transition-all duration-200"
                        >
                            <Trophy className="mr-2 h-4 w-4" /> Points
                        </TabsTrigger>
                        <TabsTrigger
                            value="correct"
                            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-white/70 rounded-lg data-[state=active]:shadow-glow-sm transition-all duration-200"
                        >
                            <Target className="mr-2 h-4 w-4" /> Correct Answers
                        </TabsTrigger>
                        <TabsTrigger
                            value="streak"
                            className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-white/70 rounded-lg data-[state=active]:shadow-glow-sm transition-all duration-200"
                        >
                            <Flame className="mr-2 h-4 w-4" /> Best Streak
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="points">
                        <Card className="border-none bg-white/10 backdrop-blur-sm overflow-hidden shadow-glow-sm">
                            <CardContent className="p-0">
                                <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-white/10">
                                    {players.map((player, index) => (
                                        <motion.div
                                            key={player.id}
                                            variants={item}
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                            className={cn(
                                                "flex items-center p-4 transition-all duration-200",
                                                index < 3 ? "bg-gradient-to-r from-purple-500/10 to-transparent" : "",
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-glow-sm",
                                                    index === 0
                                                        ? "bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-glow-yellow"
                                                        : index === 1
                                                            ? "bg-gradient-to-br from-slate-300 to-slate-500"
                                                            : index === 2
                                                                ? "bg-gradient-to-br from-amber-500 to-amber-800 shadow-glow-amber"
                                                                : "bg-gradient-to-br from-purple-500 to-indigo-600",
                                                )}
                                            >
                                                {index + 1}
                                            </div>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                                                transition={{ duration: 0.5 }}
                                                className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-3xl mx-4 shadow-glow-sm"
                                            >
                                                {player.avatar}
                                            </motion.div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white text-lg drop-shadow-glow">{player.name}</h3>
                                                <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(player.score / players[0].score) * 100}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={cn(
                                                            "h-full rounded-full shadow-glow-sm",
                                                            index === 0
                                                                ? "bg-gradient-to-r from-yellow-300 to-yellow-600 shadow-glow-yellow"
                                                                : index === 1
                                                                    ? "bg-gradient-to-r from-slate-300 to-slate-500"
                                                                    : index === 2
                                                                        ? "bg-gradient-to-r from-amber-500 to-amber-800"
                                                                        : "bg-gradient-to-r from-purple-500 to-indigo-600",
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                                                className="text-2xl font-bold text-white drop-shadow-glow"
                                            >
                                                {player.score.toLocaleString()}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="correct">
                        <Card className="border-none bg-white/10 backdrop-blur-sm overflow-hidden shadow-glow-sm">
                            <CardContent className="p-0">
                                <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-white/10">
                                    {[...players]
                                        .sort((a, b) => b.correctAnswers - a.correctAnswers)
                                        .map((player, index) => (
                                            <motion.div
                                                key={player.id}
                                                variants={item}
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                                className={cn(
                                                    "flex items-center p-4 transition-all duration-200",
                                                    index < 3 ? "bg-gradient-to-r from-green-500/10 to-transparent" : "",
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-glow-sm",
                                                        index === 0
                                                            ? "bg-gradient-to-br from-green-300 to-green-600 shadow-glow-green"
                                                            : index === 1
                                                                ? "bg-gradient-to-br from-green-200 to-green-500"
                                                                : index === 2
                                                                    ? "bg-gradient-to-br from-green-400 to-green-700"
                                                                    : "bg-gradient-to-br from-purple-500 to-indigo-600",
                                                    )}
                                                >
                                                    {index + 1}
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                                                    transition={{ duration: 0.5 }}
                                                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-3xl mx-4 shadow-glow-sm"
                                                >
                                                    {player.avatar}
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-lg drop-shadow-glow">{player.name}</h3>
                                                    <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(player.correctAnswers / 5) * 100}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full rounded-full bg-gradient-to-r from-green-300 to-green-600 shadow-glow-green"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <motion.div
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                                                        className="text-2xl font-bold text-white drop-shadow-glow"
                                                    >
                                                        {player.correctAnswers}
                                                    </motion.div>
                                                    <div className="text-white/50 ml-2 text-lg">/5</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="streak">
                        <Card className="border-none bg-white/10 backdrop-blur-sm overflow-hidden shadow-glow-sm">
                            <CardContent className="p-0">
                                <motion.div variants={container} initial="hidden" animate="show" className="divide-y divide-white/10">
                                    {[...players]
                                        .sort((a, b) => b.streak - a.streak)
                                        .map((player, index) => (
                                            <motion.div
                                                key={player.id}
                                                variants={item}
                                                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                                className={cn(
                                                    "flex items-center p-4 transition-all duration-200",
                                                    index < 3 ? "bg-gradient-to-r from-orange-500/10 to-transparent" : "",
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-full text-white font-bold shadow-glow-sm",
                                                        index === 0
                                                            ? "bg-gradient-to-br from-orange-300 to-red-600 shadow-glow-orange"
                                                            : index === 1
                                                                ? "bg-gradient-to-br from-orange-200 to-red-500"
                                                                : index === 2
                                                                    ? "bg-gradient-to-br from-orange-400 to-red-700"
                                                                    : "bg-gradient-to-br from-purple-500 to-indigo-600",
                                                    )}
                                                >
                                                    {index + 1}
                                                </div>
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                                                    transition={{ duration: 0.5 }}
                                                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10 text-3xl mx-4 shadow-glow-sm"
                                                >
                                                    {player.avatar}
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-white text-lg drop-shadow-glow">{player.name}</h3>
                                                    <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(player.streak / 3) * 100}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full rounded-full bg-gradient-to-r from-orange-300 to-red-600 shadow-glow-orange"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Flame className="h-6 w-6 text-orange-400 animate-pulse" />
                                                    <motion.div
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                                                        className="text-2xl font-bold text-white drop-shadow-glow"
                                                    >
                                                        {player.streak}
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

