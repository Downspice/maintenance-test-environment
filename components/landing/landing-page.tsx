"use client";

import Link from "next/link";
import { useState, useId, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useSpring,
  useMotionValue,
} from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Tractor,
  Package,
  Users,
  Store,
  BarChart,
  HelpCircle,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Menu,
  X,
  Wrench,
  Gauge,
  Shield,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LogoWordmark } from "@/components/landing/logo-mark";
import { LogoMark } from "@/components/landing/logo-mark";
import { cn } from "@/lib/shared/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOM EASING TOKENS (from animate skill — never use built-in ease-out)
   ─────────────────────────────────────────────────────────────────────────── */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MODULE DATA
   ─────────────────────────────────────────────────────────────────────────── */
interface ModuleConfig {
  id: string;
  name: string;
  tag: string;
  icon: LucideIcon;
  path: string;
  statusBadge: string;
  statusColor: string;
  snippetTitle: string;
  snippetDetail: string;
  accentFrom: string;
  accentTo: string;
}

const MODULES: ModuleConfig[] = [
  {
    id: "wo",
    name: "Work Orders",
    tag: "Execution",
    icon: ClipboardList,
    path: "/work-orders",
    statusBadge: "WO-1842 Active",
    statusColor: "text-blue-600 bg-blue-50 border-blue-200",
    snippetTitle: "WO-1842 · Conveyor Drive PM",
    snippetDetail: "North Crew · In Progress · 1 Belt Kit reserved",
    accentFrom: "#3b82f6",
    accentTo: "#06b6d4",
  },
  {
    id: "eq",
    name: "Equipment",
    tag: "Assets",
    icon: Tractor,
    path: "/equipment",
    statusBadge: "98.4% Health",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    snippetTitle: "Hydraulic Press #4",
    snippetDetail: "1,420 Run-Hours · PM due in 3 days",
    accentFrom: "#10b981",
    accentTo: "#34d399",
  },
  {
    id: "inv",
    name: "Inventory",
    tag: "Parts",
    icon: Package,
    path: "/inventory",
    statusBadge: "Stock Synced",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
    snippetTitle: "SKU 4401 · Belt Kit",
    snippetDetail: "12 On Hand · 2 Reserved · Bin B-14",
    accentFrom: "#f59e0b",
    accentTo: "#fbbf24",
  },
  {
    id: "wf",
    name: "Workforce",
    tag: "People",
    icon: Users,
    path: "/employees",
    statusBadge: "100% Coverage",
    statusColor: "text-purple-700 bg-purple-50 border-purple-200",
    snippetTitle: "Morning Ops Crew",
    snippetDetail: "8 Techs active · 2 Leads on shift",
    accentFrom: "#8b5cf6",
    accentTo: "#a78bfa",
  },
  {
    id: "ven",
    name: "Vendors",
    tag: "Supply",
    icon: Store,
    path: "/vendors",
    statusBadge: "PO-9021",
    statusColor: "text-rose-700 bg-rose-50 border-rose-200",
    snippetTitle: "Apex Hydraulics",
    snippetDetail: "PO fulfilled · Net 30 · Preferred",
    accentFrom: "#f43f5e",
    accentTo: "#fb7185",
  },
  {
    id: "ana",
    name: "Analytics",
    tag: "Intel",
    icon: BarChart,
    path: "/reports",
    statusBadge: "96.2% PM",
    statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    snippetTitle: "Facility Overview",
    snippetDetail: "Downtime -14% MoM · 0 Critical",
    accentFrom: "#6366f1",
    accentTo: "#818cf8",
  },
];

const faqs = [
  {
    q: "What is Maintenance OS?",
    a: "An integrated maintenance and operations workspace that combines work orders, equipment, inventory, vendors, workforce, and analytics on one shared record set.",
  },
  {
    q: "Do we have to adopt every module?",
    a: "No. Start with the module you need today and add others as you grow. All modules seamlessly share the same assets, parts, and workforce records.",
  },
  {
    q: "Can this work with our existing ERP?",
    a: "Yes. The suite is designed to run alongside ERP and accounting systems, providing real-time shop-floor execution while syncing accounting and inventory data.",
  },
  {
    q: "Is there a mobile experience for technicians?",
    a: "Yes. Technicians receive and update work orders, upload photos, and scan parts from any mobile browser or tablet with full offline capability.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING OBJECTS — CSS keyframe-driven (off main thread, smooth under load)
   Each object is a glassmorphic card with an icon related to the application
   ─────────────────────────────────────────────────────────────────────────── */
interface FloatingObject {
  icon: LucideIcon;
  label: string;
  x: string;
  y: string;
  size: "sm" | "md" | "lg";
  delay: string;
  duration: string;
  drift: "float-drift-a" | "float-drift-b" | "float-drift-c";
}

const FLOATING_OBJECTS: FloatingObject[] = [
  { icon: Wrench, label: "PM", x: "8%", y: "18%", size: "md", delay: "0s", duration: "18s", drift: "float-drift-a" },
  { icon: Gauge, label: "MTBF", x: "85%", y: "12%", size: "sm", delay: "2s", duration: "22s", drift: "float-drift-b" },
  { icon: Shield, label: "Audit", x: "78%", y: "72%", size: "md", delay: "1s", duration: "20s", drift: "float-drift-c" },
  { icon: Zap, label: "Live", x: "12%", y: "75%", size: "sm", delay: "3s", duration: "24s", drift: "float-drift-a" },
  { icon: ClipboardList, label: "WO", x: "92%", y: "42%", size: "lg", delay: "0.5s", duration: "19s", drift: "float-drift-b" },
  { icon: Package, label: "Parts", x: "5%", y: "48%", size: "sm", delay: "1.5s", duration: "21s", drift: "float-drift-c" },
  { icon: Tractor, label: "Asset", x: "72%", y: "88%", size: "sm", delay: "2.5s", duration: "23s", drift: "float-drift-a" },
  { icon: BarChart, label: "KPI", x: "22%", y: "90%", size: "md", delay: "4s", duration: "17s", drift: "float-drift-b" },
];

const floatingSizes = {
  sm: "size-8 text-[9px]",
  md: "size-10 text-[10px]",
  lg: "size-12 text-[11px]",
} as const;

const floatingIconSizes = {
  sm: "size-3",
  md: "size-3.5",
  lg: "size-4",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   ORBITAL RING — the 6 module icons orbiting a central hub
   Pure CSS animations for buttery smooth motion off the main thread
   ─────────────────────────────────────────────────────────────────────────── */
function OrbitalRing({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="landing-orbital-container relative mx-auto aspect-square w-[280px] sm:w-[320px] lg:w-[340px]">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-base/8 to-transparent" />

      {/* Concentric rings */}
      <svg
        viewBox="0 0 340 340"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-base)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-primary-base)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <circle cx="170" cy="170" r="155" fill="none" stroke="url(#ring-grad)" strokeWidth="1" />
        <circle cx="170" cy="170" r="120" fill="none" stroke="url(#ring-grad)" strokeWidth="0.6" strokeDasharray="4 6" />
        <circle cx="170" cy="170" r="80" fill="none" stroke="url(#ring-grad)" strokeWidth="0.4" strokeDasharray="2 8" />
        {/* Animated sweeper line */}
        {!reduceMotion && (
          <line
            x1="170" y1="170" x2="170" y2="15"
            stroke="var(--color-primary-base)"
            strokeOpacity="0.12"
            strokeWidth="0.8"
            className="landing-orbital-sweeper"
            style={{ transformOrigin: "170px 170px" }}
          />
        )}
      </svg>

      {/* Central hub */}
      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div
          className={cn(
            "flex size-16 sm:size-[4.5rem] items-center justify-center rounded-2xl border bg-bg-white-0/95 shadow-regular-sm backdrop-blur-sm transition-transform duration-200",
            "border-primary-base/25",
            !reduceMotion && "landing-hub-pulse"
          )}
        >
          <LogoMark size="sm" />
        </div>
        <span className="mt-1.5 text-[9px] font-bold tracking-[0.16em] text-primary-dark uppercase">
          Shared Core
        </span>
      </div>

      {/* Orbiting nodes */}
      {MODULES.map((mod, i) => {
        const Icon = mod.icon;
        const isActive = mod.id === activeId;
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const radius = 140;
        const cx = 50 + (Math.cos(angle) * radius) / 3.4;
        const cy = 50 + (Math.sin(angle) * radius) / 3.4;

        return (
          <div
            key={mod.id}
            className="absolute z-20"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <button
              type="button"
              onClick={() => onSelect(mod.id)}
              className={cn(
                "group flex flex-col items-center gap-1 outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary-base/40 rounded-xl"
              )}
              aria-label={`Select ${mod.name}`}
              aria-pressed={isActive}
            >
              <div
                className={cn(
                  "landing-orbit-node flex size-10 sm:size-11 items-center justify-center rounded-xl border-2 backdrop-blur-sm shadow-regular-xs",
                  "transition-transform duration-200 transition-colors duration-200",
                  isActive
                    ? "border-primary-base bg-primary-lighter text-primary-dark shadow-regular-sm"
                    : "border-stroke-soft-200/80 bg-bg-white-0/90 text-text-sub-600 group-hover:border-primary-base/40 group-hover:text-primary-base",
                  !reduceMotion && "landing-orbit-bob"
                )}
                style={{
                  animationDelay: `${i * 0.6}s`,
                  ...(isActive && {
                    boxShadow: `0 0 20px ${mod.accentFrom}22, 0 4px 12px ${mod.accentFrom}18`,
                  }),
                }}
              >
                <Icon className="size-4 sm:size-[18px]" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={cn(
                  "text-[9px] font-semibold tracking-wide uppercase transition-colors duration-200",
                  isActive ? "text-primary-dark" : "text-text-soft-400 group-hover:text-text-sub-600"
                )}
              >
                {mod.name}
              </span>
            </button>

            {/* Active connection line (drawn with CSS) */}
            {isActive && !reduceMotion && (
              <div
                className="landing-active-pulse pointer-events-none absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-xl"
                style={{
                  background: `radial-gradient(circle, ${mod.accentFrom}15 0%, transparent 70%)`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOUSE PARALLAX — spring-based, decorative (animate skill §5: spring for
   mouse-tracking because it's decorative, useSpring adds momentum)
   ─────────────────────────────────────────────────────────────────────────── */
function useMouseParallax(factor = 0.02) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (reduceMotion) return;
    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) * factor);
      mouseY.set((e.clientY - cy) * factor);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [factor, mouseX, mouseY, reduceMotion]);

  return { x: springX, y: springY };
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANDING PAGE COMPONENT
   ─────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [activeModuleId, setActiveModuleId] = useState("wo");
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const walkthroughFormId = useId();
  const reduceMotion = useReducedMotion();
  const parallax = useMouseParallax(0.015);

  const activeModule = MODULES.find((m) => m.id === activeModuleId) ?? MODULES[0];
  const ActiveIcon = activeModule.icon;

  // Auto-cycle modules for the orbital demo
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveModuleId((prev) => {
        const idx = MODULES.findIndex((m) => m.id === prev);
        return MODULES[(idx + 1) % MODULES.length].id;
      });
    }, 4000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, []);

  // Stop autoplay on user interaction
  function selectModule(id: string) {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = null;
    setActiveModuleId(id);
  }

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thanks — we'll tailor a live walkthrough to your operation.");
    setWalkthroughOpen(false);
  }

  return (
    <div
      className="landing-page relative flex h-screen max-h-screen flex-col overflow-hidden font-sans text-text-strong-950 antialiased"
      style={{ background: "var(--gradient-background)" }}
    >
      {/* ━━━ FLOATING OBJECTS (CSS keyframes — off main thread) ━━━ */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Ambient radial glows */}
        <div className="landing-glow-a absolute -top-[20%] -left-[10%] size-[600px] rounded-full bg-primary-base/[0.04] blur-[120px]" />
        <div className="landing-glow-b absolute -bottom-[15%] -right-[10%] size-[500px] rounded-full bg-blue-500/[0.04] blur-[100px]" />

        {FLOATING_OBJECTS.map((obj) => {
          const Icon = obj.icon;
          return (
            <div
              key={obj.label}
              className={cn(
                "absolute flex flex-col items-center justify-center rounded-xl",
                "border border-stroke-soft-200/40 bg-bg-white-0/50 backdrop-blur-sm shadow-regular-xs",
                floatingSizes[obj.size],
                obj.drift,
              )}
              style={{
                left: obj.x,
                top: obj.y,
                animationDelay: obj.delay,
                animationDuration: obj.duration,
              }}
            >
              <Icon className={cn(floatingIconSizes[obj.size], "text-primary-base/60")} strokeWidth={1.5} />
              <span className="mt-0.5 font-bold text-text-soft-400/70">{obj.label}</span>
            </div>
          );
        })}

        {/* Tiny floating dots (purely decorative ambient particles) */}
        {!reduceMotion && (
          <>
            <div className="landing-particle absolute left-[30%] top-[25%] size-1.5 rounded-full bg-primary-base/20" style={{ animationDelay: "0s" }} />
            <div className="landing-particle absolute left-[65%] top-[15%] size-1 rounded-full bg-blue-400/25" style={{ animationDelay: "3s" }} />
            <div className="landing-particle absolute left-[45%] top-[80%] size-1.5 rounded-full bg-emerald-400/20" style={{ animationDelay: "1.5s" }} />
            <div className="landing-particle absolute left-[80%] top-[55%] size-1 rounded-full bg-amber-400/20" style={{ animationDelay: "4s" }} />
            <div className="landing-particle absolute left-[15%] top-[60%] size-1 rounded-full bg-violet-400/20" style={{ animationDelay: "2s" }} />
          </>
        )}
      </div>

      {/* ━━━ 1. HEADER ━━━ */}
      <motion.header
        className="relative z-30 shrink-0 border-b border-stroke-soft-200/80 bg-bg-white-0/70 backdrop-blur-xl"
        initial={reduceMotion ? false : { transform: "translateY(-100%)", opacity: 0 }}
        animate={{ transform: "translateY(0)", opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0">
            <LogoWordmark compact priority />
          </Link>

          {/* Live status pill */}
          <div className="hidden items-center gap-2 rounded-full border border-stroke-soft-200/60 bg-bg-white-0/60 px-3 py-1 text-xs text-text-sub-600 shadow-regular-xs backdrop-blur-sm md:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-text-strong-950">Live Sync</span>
            <span className="text-text-soft-400">·</span>
            <span>6 Modules</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost" size="sm"
              className="hidden text-xs text-text-sub-600 hover:text-text-strong-950 sm:inline-flex"
              onClick={() => setFaqOpen(true)}
            >
              <HelpCircle className="mr-1.5 size-3.5" />FAQ
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-text-sub-600 hover:text-text-strong-950" asChild>
              <Link href="/dashboard">Sign in</Link>
            </Button>
            <Button size="sm" variant="primary" className="text-xs" asChild>
              <Link href="/dashboard">
                Open workspace<ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-stroke-soft-200 text-text-sub-600 sm:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-stroke-soft-200 bg-bg-white-0 px-4 py-3 sm:hidden">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="sm" className="justify-start text-xs" onClick={() => { setFaqOpen(true); setMobileMenuOpen(false); }}>
                <HelpCircle className="mr-2 size-3.5" />FAQ
              </Button>
              <Button variant="secondary" size="sm" className="justify-start text-xs" onClick={() => { setWalkthroughOpen(true); setMobileMenuOpen(false); }}>
                <Sparkles className="mr-2 size-3.5" />Request Walkthrough
              </Button>
            </div>
          </div>
        )}
      </motion.header>

      {/* ━━━ 2. MAIN HERO — single frame ━━━ */}
      <main className="relative z-10 flex flex-1 items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12"
          style={reduceMotion ? undefined : { x: parallax.x, y: parallax.y }}
        >
          {/* ── LEFT: Copy + CTAs ── */}
          <div className="flex flex-col">
            {/* Badge — stagger index 0 */}
            <motion.div
              initial={reduceMotion ? false : { transform: "translateY(12px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 }}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-stroke-soft-200/60 bg-bg-white-0/70 px-3.5 py-1.5 text-xs text-text-sub-600 shadow-regular-xs backdrop-blur-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-base opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary-base" />
              </span>
              Unified Maintenance Operations
            </motion.div>

            {/* Headline — stagger index 1 */}
            <motion.h1
              initial={reduceMotion ? false : { transform: "translateY(16px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.16 }}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Run the entire operation{" "}
              <span className="bg-gradient-to-r from-primary-base to-primary-dark bg-clip-text text-transparent">
                from one platform.
              </span>
            </motion.h1>

            {/* Sub — stagger index 2 */}
            <motion.p
              initial={reduceMotion ? false : { transform: "translateY(12px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.22 }}
              className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-text-sub-600 sm:text-base"
            >
              Work orders, equipment, inventory, workforce, and vendors — one
              synchronized core. Zero reconciliation. 100% auditable.
            </motion.p>

            {/* CTAs — stagger index 3 */}
            <motion.div
              initial={reduceMotion ? false : { transform: "translateY(12px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.28 }}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" variant="primary" className="shadow-regular-xs landing-btn-glow" asChild>
                <Link href="/dashboard">
                  Launch workspace
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" onClick={() => setWalkthroughOpen(true)}>
                <Sparkles className="mr-2 size-4 text-primary-base" />
                Request walkthrough
              </Button>
            </motion.div>

            {/* Stats row — stagger index 4 */}
            <motion.div
              initial={reduceMotion ? false : { transform: "translateY(12px)", opacity: 0 }}
              animate={{ transform: "translateY(0)", opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.36 }}
              className="mt-8 grid grid-cols-3 gap-3"
            >
              {[
                { label: "6 Modules", sub: "Shared live data" },
                { label: "Field Sync", sub: "Mobile & floor ready" },
                { label: "100% Audit", sub: "Total traceability" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-xl border border-stroke-soft-200/60 bg-bg-white-0/60 p-2.5 shadow-regular-xs backdrop-blur-sm transition-all duration-200 hover:border-primary-base/30 hover:bg-bg-white-0/80 hover:shadow-regular-sm sm:p-3"
                >
                  <p className="text-xs font-semibold text-text-strong-950 sm:text-sm">{stat.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-text-sub-600 sm:text-[11px]">{stat.sub}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Interactive Orbital + Module Detail ── */}
          <motion.div
            initial={reduceMotion ? false : { transform: "scale(0.96)", opacity: 0 }}
            animate={{ transform: "scale(1)", opacity: 1 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.2 }}
            className="relative flex flex-col items-center"
          >
            {/* Orbital visualization */}
            <OrbitalRing activeId={activeModuleId} onSelect={selectModule} />

            {/* Active Module Card — animated swap */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModuleId}
                initial={reduceMotion ? false : { transform: "translateY(8px) scale(0.97)", opacity: 0 }}
                animate={{ transform: "translateY(0) scale(1)", opacity: 1 }}
                exit={reduceMotion ? undefined : { transform: "translateY(-6px) scale(0.98)", opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="mt-4 w-full max-w-sm rounded-xl border border-stroke-soft-200/70 bg-bg-white-0/80 p-3 shadow-regular-sm backdrop-blur-md sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${activeModule.accentFrom}18, ${activeModule.accentTo}10)`,
                      border: `1px solid ${activeModule.accentFrom}30`,
                    }}
                  >
                    <ActiveIcon className="size-4" style={{ color: activeModule.accentFrom }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-semibold text-text-strong-950">
                        {activeModule.snippetTitle}
                      </p>
                      <span className={cn("shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold", activeModule.statusColor)}>
                        {activeModule.statusBadge}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[10px] text-text-sub-600">
                      {activeModule.snippetDetail}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="hidden shrink-0 text-[10px] text-primary-base sm:inline-flex" asChild>
                    <Link href={activeModule.path}>
                      Open<ExternalLink className="ml-1 size-3" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </main>

      {/* ━━━ 3. COMPACT FOOTER DOCK ━━━ */}
      <motion.footer
        className="relative z-30 shrink-0 border-t border-stroke-soft-200/60 bg-bg-white-0/60 backdrop-blur-xl"
        initial={reduceMotion ? false : { transform: "translateY(100%)", opacity: 0 }}
        animate={{ transform: "translateY(0)", opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.4 }}
      >
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 px-4 text-xs text-text-sub-600 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5">
            <span className="hidden text-[10px] font-medium text-text-soft-400 lg:inline">Modules:</span>
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={mod.path}
                  title={`Open ${mod.name}`}
                  className="inline-flex size-6 items-center justify-center rounded-md text-text-sub-600 transition-colors duration-150 hover:bg-bg-weak-50 hover:text-primary-base"
                >
                  <Icon className="size-3" />
                </Link>
              );
            })}
          </div>
          <p className="hidden text-center text-[10px] text-text-soft-400 sm:block">
            Shared record architecture · Technicians, planners, and leadership connected
          </p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setFaqOpen(true)} className="text-[10px] underline-offset-4 hover:underline">FAQ</button>
            <span className="text-text-soft-400">·</span>
            <span className="text-[10px] text-text-soft-400">© {new Date().getFullYear()} Maintenance OS</span>
          </div>
        </div>
      </motion.footer>

      {/* ━━━ 4. WALKTHROUGH DRAWER ━━━ */}
      <Drawer
        open={walkthroughOpen}
        onOpenChange={setWalkthroughOpen}
        title="Request an Operations Walkthrough"
        description="Share your details and modules of interest. We will tailor a live demonstration to your facility."
        closeable={true}
        renderActions={
          <Button form={walkthroughFormId} type="submit" variant="primary">
            Submit Request
          </Button>
        }
        className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <form id={walkthroughFormId} onSubmit={handleDemoSubmit} className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="wt-name" className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Full Name</label>
              <input id="wt-name" name="name" required placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="wt-email" className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Work Email</label>
                <input id="wt-email" name="email" type="email" required placeholder="sarah@company.com"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="wt-org" className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Company</label>
                <input id="wt-org" name="org" required placeholder="Apex Manufacturing"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Modules of Interest</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {MODULES.map((m) => (
                  <label key={m.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 text-xs font-medium text-text-strong-950 hover:bg-bg-weak-50">
                    <input type="checkbox" name="modules" value={m.id} defaultChecked={m.id === "wo" || m.id === "eq"}
                      className="size-3.5 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base/40" />
                    <span>{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="wt-notes" className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Notes (Optional)</label>
              <textarea id="wt-notes" name="notes" rows={3} placeholder="Team size, assets, integrations..."
                className="w-full resize-none rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40" />
            </div>
            <div className="rounded-xl border border-primary-base/20 bg-primary-lighter/40 p-3 text-xs text-primary-dark">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="size-4 shrink-0 text-primary-base" />
                <span>Instant Prototype Access</span>
              </div>
              <p className="mt-1 text-[11px] text-text-sub-600">
                Explore our live environment directly anytime via &quot;Open workspace&quot;.
              </p>
            </div>
          </form>
        </ScrollArea>
      </Drawer>

      {/* ━━━ 5. FAQ DRAWER ━━━ */}
      <Drawer
        open={faqOpen}
        onOpenChange={setFaqOpen}
        title="Frequently Asked Questions"
        description="Learn how Maintenance OS connects your field operations and leadership dashboards."
        closeable={true}
        className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <div className="space-y-6 py-2">
            <Accordion type="single" collapsible defaultValue="faq-0" className="w-full space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`} className="rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-4">
                  <AccordionTrigger className="text-left text-sm font-semibold text-text-strong-950 py-3">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-text-sub-600 pb-3">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="rounded-xl border border-stroke-soft-200 bg-bg-weak-50/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">Direct Access</h4>
              <p className="mt-1 text-xs text-text-sub-600">Ready to see live work orders, inventory, and equipment?</p>
              <Button size="sm" variant="primary" className="mt-3 text-xs" asChild>
                <Link href="/dashboard" onClick={() => setFaqOpen(false)}>
                  Open Workspace<ArrowRight className="ml-1.5 size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </Drawer>
    </div>
  );
}
