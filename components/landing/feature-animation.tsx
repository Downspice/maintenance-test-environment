"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardList,
    Tractor,
    Package,
    Users,
    Store,
    BarChart,
    CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/shared/utils";

const features = [
    {
        icon: ClipboardList,
        label: "Work Orders",
        description: "Streamline maintenance requests with intelligent routing and real-time tracking.",
        gradient: "from-blue-500 to-cyan-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        shadow: "shadow-blue-500/20",
    },
    {
        icon: Tractor,
        label: "Equipment Hub",
        description: "Comprehensive asset lifecycle management from acquisition to retirement.",
        gradient: "from-emerald-500 to-green-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        shadow: "shadow-emerald-500/20",
    },
    {
        icon: Package,
        label: "Smart Inventory",
        description: "Automated stock control with predictive ordering and usage analytics.",
        gradient: "from-orange-500 to-amber-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        shadow: "shadow-orange-500/20",
    },
    {
        icon: Users,
        label: "Workforce",
        description: "Empower your team with scheduling, performance metrics, and mobile access.",
        gradient: "from-violet-500 to-purple-400",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        shadow: "shadow-violet-500/20",
    },
    {
        icon: Store,
        label: "Vendor Network",
        description: "Seamlessly integrate suppliers into your workflow for faster procurement.",
        gradient: "from-pink-500 to-rose-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        shadow: "shadow-pink-500/20",
    },
    {
        icon: BarChart,
        label: "Analytics Core",
        description: "Turn data into decisions with customizable, real-time dashboards.",
        gradient: "from-indigo-500 to-blue-600",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        shadow: "shadow-indigo-500/20",
    },
];

export default function FeatureAnimation() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[600px] flex items-center justify-center overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[128px] transition-colors duration-1000",
                        features[currentIndex].bg.replace("/10", "/30")
                    )}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={cn(
                        "absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[128px] transition-colors duration-1000",
                        features[(currentIndex + 1) % features.length].bg.replace("/10", "/30")
                    )}
                />
            </div>

            <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-8">
                {/* Left Content */}
                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >


                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                                <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", features[currentIndex].gradient)}>
                                    {features[currentIndex].label}
                                </span>
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                                {features[currentIndex].description}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Enterprise Ready
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    Real-time Sync
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Visual */}
                <div className="relative h-[400px] flex items-center justify-center">
                    <div className="relative w-full max-w-md aspect-square">
                        {/* Orbit Ring */}
                        <svg className="absolute inset-0 w-full h-full opacity-20 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                        </svg>

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={currentIndex}
                                initial={{ scale: 0.8, opacity: 0, rotateY: -15, y: 50 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, rotateY: 15, y: -50 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }}
                                className={cn(
                                    "absolute inset-0 flex flex-col items-center justify-center rounded-full backdrop-blur-xl shadow-2xl",
                                    features[currentIndex].bg,
                                    features[currentIndex].shadow
                                )}
                            >
                                <div className="relative z-10 p-12 rounded-full bg-white shadow-xl mb-8 group">
                                    <div className={cn("absolute inset-0 rounded-full blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-100", features[currentIndex].bg)} />
                                    {(() => {
                                        const Icon = features[currentIndex].icon;
                                        return <Icon className={cn("w-20 h-20 relative z-10 transition-transform duration-500 group-hover:scale-110", features[currentIndex].gradient.split(' ')[1].replace('to-', 'text-'))} />;
                                    })()}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/40 to-transparent rounded-b-3xl pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Floating Indicators */}
                        {features.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "absolute w-3 h-3 rounded-full transition-all duration-500",
                                    idx === currentIndex ? "scale-125 opacity-100" : "scale-100 opacity-30",
                                    features[currentIndex].gradient.split(' ')[0].replace('from-', 'bg-')
                                )}
                                style={{
                                    top: `${50 + 42 * Math.sin((idx * 2 * Math.PI) / features.length)}%`,
                                    left: `${50 + 42 * Math.cos((idx * 2 * Math.PI) / features.length)}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
