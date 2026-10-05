"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    ClipboardList,
    Tractor,
    Package,
    Users,
    Store,
    BarChart,
    CheckCircle2,
    type LucideIcon,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/shared/utils";

type Feature = {
    icon: LucideIcon;
    label: string;
    description: string;
    gradient: string;
    bg: string;
    border: string;
    shadow: string;
    iconClass: string;
    glowClass: string;
};

const features: Feature[] = [
    {
        icon: ClipboardList,
        label: "Work Orders",
        description: "Streamline maintenance requests with intelligent routing and real-time tracking.",
        gradient: "from-blue-400 to-cyan-300",
        bg: "bg-blue-500/10",
        border: "border-blue-400/30",
        shadow: "shadow-blue-500/25",
        iconClass: "text-cyan-400",
        glowClass: "bg-blue-500/40",
    },
    {
        icon: Tractor,
        label: "Equipment Hub",
        description: "Comprehensive asset lifecycle management from acquisition to retirement.",
        gradient: "from-emerald-400 to-green-300",
        bg: "bg-emerald-500/10",
        border: "border-emerald-400/30",
        shadow: "shadow-emerald-500/25",
        iconClass: "text-emerald-400",
        glowClass: "bg-emerald-500/40",
    },
    {
        icon: Package,
        label: "Smart Inventory",
        description: "Automated stock control with predictive ordering and usage analytics.",
        gradient: "from-orange-400 to-amber-300",
        bg: "bg-orange-500/10",
        border: "border-orange-400/30",
        shadow: "shadow-orange-500/25",
        iconClass: "text-amber-400",
        glowClass: "bg-orange-500/40",
    },
    {
        icon: Users,
        label: "Workforce",
        description: "Empower your team with scheduling, performance metrics, and mobile access.",
        gradient: "from-violet-400 to-purple-300",
        bg: "bg-violet-500/10",
        border: "border-violet-400/30",
        shadow: "shadow-violet-500/25",
        iconClass: "text-violet-400",
        glowClass: "bg-violet-500/40",
    },
    {
        icon: Store,
        label: "Vendor Network",
        description: "Seamlessly integrate suppliers into your workflow for faster procurement.",
        gradient: "from-pink-400 to-rose-300",
        bg: "bg-pink-500/10",
        border: "border-pink-400/30",
        shadow: "shadow-pink-500/25",
        iconClass: "text-rose-400",
        glowClass: "bg-pink-500/40",
    },
    {
        icon: BarChart,
        label: "Analytics Core",
        description: "Turn data into decisions with customizable, real-time dashboards.",
        gradient: "from-indigo-400 to-blue-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-400/30",
        shadow: "shadow-indigo-500/25",
        iconClass: "text-indigo-300",
        glowClass: "bg-indigo-500/40",
    },
];

const ROTATE_MS = 5000;

export default function FeatureAnimation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const reduceMotion = useReducedMotion();

    const goTo = useCallback((index: number) => {
        setCurrentIndex(index % features.length);
        setProgress(0);
    }, []);

    useEffect(() => {
        if (reduceMotion) return;
        const tick = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    setCurrentIndex((prev) => (prev + 1) % features.length);
                    return 0;
                }
                return p + 100 / (ROTATE_MS / 50);
            });
        }, 50);
        return () => clearInterval(tick);
    }, [reduceMotion]);

    const active = features[currentIndex];
    const ActiveIcon = active.icon;

    return (
        <div className="relative mx-auto flex w-full max-w-5xl flex-col overflow-hidden px-2 sm:px-4">
            <div className="relative flex min-h-[520px] items-center justify-center lg:min-h-[480px]">
                {/* Dynamic background */}
                <div className="pointer-events-none absolute inset-0">
                    {!reduceMotion && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className={cn(
                                    "absolute top-1/4 left-1/4 h-72 w-72 rounded-full blur-[100px] transition-colors duration-700 sm:h-96 sm:w-96 sm:blur-[128px]",
                                    active.glowClass
                                )}
                            />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className={cn(
                                    "absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full blur-[100px] transition-colors duration-700 sm:h-96 sm:w-96 sm:blur-[128px]",
                                    features[(currentIndex + 1) % features.length].glowClass
                                )}
                            />
                        </>
                    )}
                </div>

                <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
                    {/* Left content */}
                    <div className="order-2 space-y-6 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={reduceMotion ? undefined : { opacity: 0, x: 16 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-4"
                            >
                                <p className="text-sm font-medium tracking-wide text-white/45 uppercase">
                                    Module {currentIndex + 1} of {features.length}
                                </p>
                                <h3 className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl">
                                    <span
                                        className={cn(
                                            "bg-gradient-to-r bg-clip-text text-transparent",
                                            active.gradient
                                        )}
                                    >
                                        {active.label}
                                    </span>
                                </h3>
                                <p className="max-w-lg text-lg leading-relaxed text-white/55">
                                    {active.description}
                                </p>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                        Enterprise Ready
                                    </span>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                                        <CheckCircle2 className="size-4 text-emerald-400" />
                                        Real-time Sync
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Module picker */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {features.map((feature, idx) => {
                                const Icon = feature.icon;
                                const isActive = idx === currentIndex;
                                return (
                                    <button
                                        key={feature.label}
                                        type="button"
                                        onClick={() => goTo(idx)}
                                        className={cn(
                                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                                            "focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:outline-none",
                                            isActive
                                                ? cn("border-white/20 bg-white/10 text-white", feature.border)
                                                : "border-white/5 bg-transparent text-white/45 hover:border-white/15 hover:bg-white/5 hover:text-white/70"
                                        )}
                                        aria-pressed={isActive}
                                        aria-label={`Show ${feature.label}`}
                                    >
                                        <Icon className={cn("size-3.5", isActive ? feature.iconClass : "")} />
                                        <span className="hidden sm:inline">{feature.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Progress */}
                        <div className="h-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                                className={cn("h-full rounded-full bg-gradient-to-r", active.gradient)}
                                style={{ width: reduceMotion ? "100%" : `${progress}%` }}
                                transition={{ duration: 0.05 }}
                            />
                        </div>
                    </div>

                    {/* Right visual */}
                    <div className="order-1 flex h-[280px] items-center justify-center sm:h-[340px] lg:order-2 lg:h-[380px]">
                        <div className="relative aspect-square w-full max-w-[280px] sm:max-w-sm">
                            <svg
                                className="animate-spin-slow pointer-events-none absolute inset-0 h-full w-full text-white/15"
                                viewBox="0 0 100 100"
                                aria-hidden
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="48"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    strokeDasharray="4 4"
                                />
                            </svg>

                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={currentIndex}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { scale: 0.92, opacity: 0, y: 24 }
                                    }
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={
                                        reduceMotion
                                            ? undefined
                                            : { scale: 0.92, opacity: 0, y: -24 }
                                    }
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 26,
                                    }}
                                    className={cn(
                                        "absolute inset-4 flex flex-col items-center justify-center rounded-[2rem] border backdrop-blur-xl sm:inset-2",
                                        active.bg,
                                        active.border,
                                        active.shadow,
                                        "shadow-2xl"
                                    )}
                                >
                                    <div className="relative mb-6 rounded-2xl bg-white p-8 shadow-xl sm:p-10">
                                        <div
                                            className={cn(
                                                "absolute inset-0 rounded-2xl opacity-60 blur-xl",
                                                active.glowClass
                                            )}
                                        />
                                        <ActiveIcon
                                            className={cn(
                                                "relative z-10 size-16 sm:size-20",
                                                active.iconClass
                                            )}
                                            strokeWidth={1.75}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {features.map((feature, idx) => (
                                <button
                                    key={feature.label}
                                    type="button"
                                    onClick={() => goTo(idx)}
                                    className={cn(
                                        "absolute size-2.5 rounded-full transition-all duration-300 sm:size-3",
                                        idx === currentIndex
                                            ? "scale-125 opacity-100 ring-2 ring-white/30"
                                            : "scale-100 opacity-40 hover:opacity-70",
                                        feature.glowClass.replace("/40", "")
                                    )}
                                    style={{
                                        top: `${50 + 44 * Math.sin((idx * 2 * Math.PI) / features.length)}%`,
                                        left: `${50 + 44 * Math.cos((idx * 2 * Math.PI) / features.length)}%`,
                                        transform: "translate(-50%, -50%)",
                                    }}
                                    aria-label={`Go to ${feature.label}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
