"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Tractor,
  Package,
  Users,
  Store,
  BarChart,
  CheckCircle2,
  Menu,
  X,
  Gauge,
  Shield,
  Zap,
  Star,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogoMark } from "@/components/landing/logo-mark";
import { cn } from "@/lib/shared/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   EASING & ANIMATION CONSTANTS
   Following Emil Kowalski's animation philosophy (RECIPES.md):
   --ease-out: cubic-bezier(0.23, 1, 0.32, 1)
   Duration under 300ms for UI actions, active:scale-[0.97] for button presses
   ─────────────────────────────────────────────────────────────────────────── */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATED METRIC COUNTER
   Smooth RAF-driven count up on scroll into view with ease-out cubic
   ─────────────────────────────────────────────────────────────────────────── */
function AnimatedCounter({
  value,
  suffix,
}: {
  value: string;
  suffix: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [displayValue, setDisplayValue] = useState("0");
  const numValue = parseFloat(value);
  const isDecimal = value.includes(".");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }
    if (!inView) return;

    let start = 0;
    const duration = 1100;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (numValue - start) * eased;
      setDisplayValue(
        isDecimal ? current.toFixed(1) : Math.round(current).toString()
      );

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }
    const rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [inView, numValue, value, isDecimal, reduceMotion]);

  return (
    <p
      ref={ref}
      className="shrink-0 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-tight tabular-nums transition-colors duration-200"
    >
      {displayValue}
      <span className="font-serif text-[0.65em] italic font-normal text-[#1a1a1a]/50">
        {suffix}
      </span>
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
   ─────────────────────────────────────────────────────────────────────────── */
interface ServiceItem {
  num: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}

const SERVICES: ServiceItem[] = [
  {
    num: "01",
    title: "Work Order Management",
    description:
      "Create, assign, and track maintenance work from request to completion. Built-in scheduling, priority queues, and real-time status updates keep your entire operation synchronized.",
    features: [
      "Preventive & corrective WOs",
      "Priority scheduling",
      "Mobile field updates",
      "Automated assignments",
    ],
    icon: ClipboardList,
  },
  {
    num: "02",
    title: "Equipment & Asset Tracking",
    description:
      "Full lifecycle visibility for every asset — from commissioning to decommission. Track run-hours, health scores, maintenance history, and warranty status in one place.",
    features: [
      "Asset health scoring",
      "Run-hour tracking",
      "Maintenance history",
      "QR/barcode scanning",
    ],
    icon: Tractor,
  },
  {
    num: "03",
    title: "Inventory & Parts Control",
    description:
      "Real-time stock levels, automated reorder points, and bin-level tracking. Every part consumed on a work order is traced, costed, and reconciled automatically.",
    features: [
      "Real-time stock levels",
      "Automated reorder points",
      "Bin-level tracking",
      "Cost allocation",
    ],
    icon: Package,
  },
  {
    num: "04",
    title: "Workforce Coordination",
    description:
      "Manage crews, certifications, and shift coverage. Assign the right technician to the right job based on skill, location, and availability.",
    features: [
      "Crew scheduling",
      "Skill-based routing",
      "Certification tracking",
      "Overtime management",
    ],
    icon: Users,
  },
  {
    num: "05",
    title: "Vendor & Procurement",
    description:
      "Streamline purchasing from request to receipt. Manage vendor performance, purchase orders, and receiving — all linked to your inventory and work orders.",
    features: [
      "Purchase order flow",
      "Vendor scorecards",
      "Receiving & QC",
      "Contract management",
    ],
    icon: Store,
  },
  {
    num: "06",
    title: "Analytics & Reporting",
    description:
      "Actionable dashboards for MTBF, MTTR, PM compliance, and cost trends. Turn maintenance data into strategic decisions.",
    features: [
      "KPI dashboards",
      "PM compliance tracking",
      "Cost trend analysis",
      "Custom report builder",
    ],
    icon: BarChart,
  },
];

const METRICS = [
  {
    value: "98.4",
    suffix: "%",
    label: "Average uptime across all connected facilities and tracked assets.",
  },
  {
    value: "6",
    suffix: "+",
    label:
      "Integrated modules sharing one live record set — zero reconciliation.",
  },
  {
    value: "14",
    suffix: "%",
    label:
      "Average downtime reduction month-over-month after full deployment.",
  },
  {
    value: "100",
    suffix: "%",
    label:
      "Complete audit trail on every work order, part, and asset interaction.",
  },
];

const PROCESS_STEPS = [
  {
    title: "Discover & Configure",
    description:
      "Map your facility layout, assets, and team structure. We configure modules to mirror your existing workflow — no disruption.",
    icon: Gauge,
  },
  {
    title: "Connect & Integrate",
    description:
      "Link your ERP, accounting, and sensor feeds. Maintenance OS syncs bi-directionally so your source-of-truth stays unified.",
    icon: Zap,
  },
  {
    title: "Deploy & Scale",
    description:
      "Roll out to field teams with mobile-first tooling. Add facilities, crews, and modules as your operation grows.",
    icon: Shield,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR COMPONENT
   Interactive focus states, button press scale, and smooth sticky transition
   ─────────────────────────────────────────────────────────────────────────── */
function Navbar({
  onRequestDemo,
}: {
  onRequestDemo: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="group shrink-0 flex items-center gap-2.5 rounded-lg py-1 px-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97]"
        >
          <LogoMark
            size="sm"
            className="brightness-0 invert transition-transform duration-200 group-hover:scale-105"
            priority
          />
          <span className="text-base font-bold tracking-tight text-white transition-opacity group-hover:opacity-90">
            MAINTAIN
          </span>
        </Link>

        {/* Desktop Nav Items with explicit focus-visible and active feedback */}
        <div className="hidden items-center gap-1 md:flex">
          {["Home", "Modules", "Process", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-full px-4 py-2 text-sm text-white/70 transition-all duration-150 hover:text-white hover:bg-white/5 outline-none focus-visible:text-white focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97]"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-full px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97] transition-all sm:inline-flex"
            asChild
          >
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <button
            type="button"
            onClick={onRequestDemo}
            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-medium text-[#0a0a0a] shadow-sm transition-all duration-150 hover:bg-white/90 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97] sm:inline-flex"
          >
            Get Started
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:text-white hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97] md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {["Home", "Modules", "Process", "Pricing"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="rounded-lg px-4 py-2.5 text-sm text-white/70 transition-all hover:text-white hover:bg-white/5 outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 justify-start rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.98]"
                  asChild
                >
                  <Link href="/dashboard">Sign in</Link>
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    onRequestDemo();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97]"
                >
                  Get Started
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE ACCORDION WITH ANIMATED DETAIL TRANSITIONS & FOCUS STATES
   ─────────────────────────────────────────────────────────────────────────── */
function ServiceAccordion() {
  const [activeIdx, setActiveIdx] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Left: accordion list */}
      <div className="flex flex-col">
        {SERVICES.map((svc, i) => {
          const isActive = i === activeIdx;
          return (
            <button
              key={svc.num}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                "group relative flex items-center gap-4 rounded-xl border-b border-white/10 px-3 py-5 text-left transition-all duration-200 outline-none",
                "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f0f0f] focus-visible:bg-white/[0.04]",
                isActive
                  ? "opacity-100 bg-white/[0.03]"
                  : "opacity-40 hover:opacity-80 hover:bg-white/[0.015]"
              )}
            >
              {/* Active left glowing pill indicator */}
              {isActive && (
                <motion.div
                  layoutId="serviceActivePill"
                  className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="font-serif text-lg italic text-white/50 transition-colors group-hover:text-white/70">
                ({svc.num})
              </span>
              <span className="text-lg font-medium text-white transition-colors duration-150 sm:text-xl">
                {svc.title}
              </span>
              <ChevronRight
                className={cn(
                  "ml-auto size-5 text-white/40 transition-transform duration-200",
                  isActive && "rotate-90 text-white"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Right: animated detail panel */}
      <div className="relative flex flex-col justify-center">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8 shadow-2xl transition-all duration-300 hover:border-white/20">
          <AnimatePresence mode="wait">
            {(() => {
              const svc = SERVICES[activeIdx];
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.num}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 12, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={
                    reduceMotion
                      ? undefined
                      : { opacity: 0, y: -12, filter: "blur(4px)" }
                  }
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 shadow-inner">
                    <Icon className="size-6 text-white/90" />
                  </div>
                  <h4 className="mb-2 text-xl font-semibold text-white tracking-tight">
                    {svc.title}
                  </h4>
                  <p className="mb-6 text-sm leading-relaxed text-white/70 sm:text-base">
                    {svc.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    {svc.features.map((feat, fIdx) => (
                      <motion.div
                        key={feat}
                        initial={
                          reduceMotion ? false : { opacity: 0, x: -6 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: fIdx * 0.04,
                          ease: EASE_OUT,
                        }}
                        className="flex items-center gap-2 text-sm text-white/80"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-white/50" />
                        {feat}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
   ─────────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(
      "Thanks — we'll tailor a live walkthrough to your operation."
    );
    setDemoOpen(false);
  }

  return (
    <div className="landing-page-v2 relative w-full overflow-x-hidden bg-[#f5f5f3] text-[#1a1a1a]">
      <Navbar onRequestDemo={() => setDemoOpen(true)} />

      {/* ================================================================
          1. HERO — Full-screen dark with background image & fluid motion
          ================================================================ */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#0a0a0a]"
      >
        {/* Background image with subtle ambient pulse */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-hero-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-60 scale-105 animate-[pulse_8s_ease-in-out_infinite]"
            style={{ animationDuration: "14s" }}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/85" />
          {/* Subtle luminous ambient spotlight */}
          <div className="pointer-events-none absolute -top-40 left-1/2 size-[650px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-24 pb-12 lg:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Tagline pill */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md"
            >
              <LogoMark size="xs" variant="white" className="opacity-80" />
              <span className="text-xs font-medium tracking-wide text-white/80 uppercase">
                Autonomous Industrial Operations
              </span>
            </motion.div>

            <motion.h1
              className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tighter text-white"
              initial={reduceMotion ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE_OUT, delay: 0.15 }}
            >
              Maintain
              <br />
              <span className="font-serif italic font-normal tracking-tight text-white/70">
                &amp;&nbsp;
              </span>
              Operate
            </motion.h1>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="relative z-10 px-6 pb-8 lg:px-10"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.35 }}
        >
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Left description */}
            <div className="max-w-md">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
                <LogoMark size="xs" variant="white" className="opacity-60" />
                <span>Unified Maintenance Platform</span>
              </div>
              <p className="text-sm leading-relaxed text-white/70 sm:text-base">
                We turn complex maintenance operations into streamlined,
                auditable workflows. One platform for your entire facility.
              </p>
              <p className="mt-2 text-xs text-white/40">
                © {new Date().getFullYear()} Maintenance Operations Suite
              </p>
            </div>

            {/* Right: numbered features with focus states */}
            <div className="flex flex-col gap-1 text-right">
              {[
                { n: "01", label: "Work Order Management" },
                { n: "02", label: "Equipment Tracking" },
                { n: "03", label: "Inventory Control" },
                { n: "04", label: "Workforce Coordination" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="flex items-center justify-end gap-3 text-sm text-white/80 transition-colors duration-150 hover:text-white"
                >
                  <span className="font-serif italic text-white/40">
                    ({item.n})
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-2 self-end rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm shadow-md transition-all duration-150 hover:bg-white hover:text-[#0a0a0a] outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] active:scale-[0.97]"
              >
                Launch workspace
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          2. ABOUT / MISSION — Light section with diagonal texture
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#f5f5f3] px-6 py-32 lg:px-10 lg:py-44">
        {/* Subtle diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 80px,
              #000 80px,
              #000 81px
            )`,
          }}
        />

        <div className="relative mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-8 flex items-center justify-between text-xs text-[#1a1a1a]/40">
              <div className="flex items-center gap-2">
                <LogoMark size="xs" variant="black" className="opacity-50" />
                <span>Inside the Platform</span>
              </div>
              <span>(©19–26)</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="mx-auto max-w-4xl text-center text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight">
              Driven by{" "}
              <span className="font-serif italic font-normal">
                Reliability,
              </span>{" "}
              fueled by data. We craft operations‑first solutions that help{" "}
              <span className="font-serif italic font-normal">
                Facilities
              </span>{" "}
              run and thrive in the modern age
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <div
                tabIndex={0}
                className="flex items-center gap-3 rounded-xl border border-[#1a1a1a]/10 bg-white/70 px-5 py-3 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-[#1a1a1a]/20 outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">4.9/5</p>
                  <p className="text-xs text-[#1a1a1a]/50">
                    Based on 250 reviews
                  </p>
                </div>
              </div>
              <div className="h-8 w-px bg-[#1a1a1a]/10" />
              <div
                tabIndex={0}
                className="flex items-center gap-3 rounded-xl border border-[#1a1a1a]/10 bg-white/70 px-5 py-3 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:border-[#1a1a1a]/20 outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
              >
                <div className="flex">
                  {[1, 2, 3, 4].map((s) => (
                    <Star
                      key={s}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <Star className="size-4 fill-amber-400/30 text-amber-400/30" />
                </div>
                <div>
                  <p className="text-sm font-semibold">4.0/5</p>
                  <p className="text-xs text-[#1a1a1a]/50">
                    Based on 186 reviews
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
          3. ABOUT DETAIL — Image with hover depth + description text
          ================================================================ */}
      <section className="bg-[#f5f5f3] px-6 pb-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div
              tabIndex={0}
              className="group relative mx-auto aspect-[16/7] max-w-4xl overflow-hidden rounded-2xl border border-[#1a1a1a]/10 shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
            >
              <Image
                src="/landing-team-bg.jpg"
                alt="Operations center"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md shadow-lg transition-all duration-150 hover:bg-white/20 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:scale-[0.97]"
                >
                  <LogoMark size="sm" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">
                      Discuss your operations
                    </p>
                    <p className="text-xs text-white/70">
                      Speak with our engineering lead
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-relaxed text-[#1a1a1a]/70 sm:text-lg">
              We&apos;re not just building software — we&apos;re{" "}
              <strong className="text-[#1a1a1a]">
                operational partners
              </strong>
              , problem-solvers, and{" "}
              <strong className="text-[#1a1a1a]">system builders</strong>.
              Blending deep maintenance expertise with modern technology, we
              craft experiences that connect, optimize, and stand out in a{" "}
              <strong className="text-[#1a1a1a]">
                complex industrial
              </strong>{" "}
              world.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="mt-8 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#333] hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 active:scale-[0.97]"
              >
                View our platform
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
          4. SERVICES — Dark section with interactive accordion
          ================================================================ */}
      <section
        id="modules"
        className="relative overflow-hidden bg-[#0f0f0f] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center gap-2 text-sm text-white/40">
              <LogoMark size="xs" variant="white" className="opacity-60" />
              <span>What we build</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mb-16 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1] tracking-tight text-white">
              Solutions that{" "}
              <span className="font-serif italic font-normal text-white/60">
                Drive
              </span>
              <br />
              results
            </h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <ServiceAccordion />
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
          5. PROCESS — Step cards with rich focus & hover elevation
          ================================================================ */}
      <section
        id="process"
        className="relative bg-[#f5f5f3] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 80px,
              #000 80px,
              #000 81px
            )`,
          }}
        />

        <div className="relative mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#1a1a1a]/40">
              <LogoMark size="xs" variant="black" className="opacity-50" />
              <span>From concept to launch</span>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="mb-20 text-center text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight">
              Your operations{" "}
              <span className="font-serif italic font-normal">
                transform
              </span>
              <br />
              into{" "}
              <span className="font-serif italic font-normal">
                Reliable
              </span>{" "}
              systems
            </h2>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeUp key={step.title} delay={0.12 + i * 0.08}>
                  <div
                    tabIndex={0}
                    className="group relative rounded-2xl border border-[#1a1a1a]/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-[#1a1a1a]/20 hover:shadow-xl focus:-translate-y-1.5 focus:border-[#1a1a1a]/30 focus:shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 sm:p-8"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
                        {step.title}
                      </h3>
                      <div className="flex items-center">
                        <LogoMark
                          size="2xs"
                          variant="black"
                          className="opacity-25 transition-opacity duration-200 group-hover:opacity-70 group-focus:opacity-70"
                        />
                      </div>
                    </div>
                    <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#f5f5f3] transition-transform duration-200 group-hover:scale-105 group-focus:scale-105">
                      <Icon className="size-8 text-[#1a1a1a]/60 transition-colors duration-200 group-hover:text-[#1a1a1a]" />
                    </div>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                      {step.description}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          6. METRICS — Animated count up numbers on scroll & focus states
          ================================================================ */}
      <section className="bg-[#f5f5f3] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left text */}
            <div>
              <FadeUp>
                <div className="mb-4 flex items-center gap-2 text-sm text-[#1a1a1a]/40">
                  <LogoMark size="xs" variant="black" className="opacity-50" />
                  <span>Our track record</span>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1] tracking-tight">
                  Metrics that{" "}
                  <span className="font-serif italic font-normal">
                    Prove
                  </span>
                  <br />
                  value
                </h2>
              </FadeUp>
              <FadeUp delay={0.2}>
                <Link
                  href="/dashboard"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-[#333] hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 active:scale-[0.97]"
                >
                  Know more about us
                  <ArrowRight className="size-4" />
                </Link>
              </FadeUp>
            </div>

            {/* Right metric rows with animated count-up numbers */}
            <div className="flex flex-col">
              {METRICS.map((metric, i) => (
                <FadeUp key={metric.value} delay={0.12 + i * 0.08}>
                  <div
                    tabIndex={0}
                    className={cn(
                      "group flex items-center gap-6 py-6 px-3 rounded-xl transition-all duration-150 outline-none hover:bg-black/[0.02] focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:bg-black/[0.03]",
                      i < METRICS.length - 1 && "border-b border-[#1a1a1a]/10"
                    )}
                  >
                    <AnimatedCounter
                      value={metric.value}
                      suffix={metric.suffix}
                    />
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/70">
                      {metric.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          7. PRICING — Undisclosed
          ================================================================ */}
      <section
        id="pricing"
        className="relative overflow-hidden bg-[#0f0f0f] px-6 py-28 lg:px-10 lg:py-36"
      >
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/40">
              <LogoMark size="xs" variant="white" className="opacity-60" />
              <span>Investment &amp; Scoping</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mb-6 text-center text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1] tracking-tight text-white">
              Pricing{" "}
              <span className="font-serif italic font-normal text-white/60">
                Undisclosed
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-white/60 sm:text-base">
              Every facility footprint, equipment volume, and integration
              requirement is unique. We provide tailored scopes and SLA guarantees
              following an initial operational walkthrough.
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm shadow-xl transition-all duration-300 hover:border-white/20">
              <div className="mb-4 flex items-center justify-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-emerald-400">
                  Custom Enterprise SLA Scoping
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white tracking-tight">
                Schedule a discovery walkthrough
              </h3>
              <p className="mb-8 text-sm text-white/50 max-w-md mx-auto">
                Connect directly with our engineering lead to map your facility layout and receive a tailored deployment proposal.
              </p>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#0a0a0a] shadow-lg transition-all duration-150 hover:bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:scale-[0.97]"
              >
                Schedule a discovery call
                <ArrowRight className="size-4" />
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
          8. TEAM / CTA — Full-bleed dark image with text overlay
          ================================================================ */}
      <section className="relative min-h-[80vh] overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-team-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/45 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-[80vh] flex-col justify-between px-6 py-16 lg:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <FadeUp>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <LogoMark size="xs" variant="white" className="opacity-60" />
                <span>Your operational partners</span>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h2 className="mt-8 max-w-2xl text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.9] tracking-tighter text-white">
                We&apos;re your{" "}
                <span className="font-serif italic font-normal text-white/70">
                  Operations
                </span>{" "}
                partners
              </h2>
            </FadeUp>
          </div>

          <div className="mx-auto w-full max-w-[1400px]">
            <FadeUp delay={0.2}>
              <p className="max-w-xl text-base leading-relaxed text-white/60">
                We&apos;re a dedicated team that values purposeful design,
                operational excellence, and work that truly makes an impact
                on your bottom line.
              </p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] shadow-sm transition-all duration-150 hover:bg-white/90 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:scale-[0.97]"
                >
                  Launch workspace
                  <ArrowRight className="size-4" />
                </Link>
                <span className="text-xs text-white/30">
                  © {new Date().getFullYear()} Maintain — Team up with us
                </span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ================================================================
          9. FOOTER
          ================================================================ */}
      <footer className="bg-[#0a0a0a] px-6 py-12 lg:px-10 border-t border-white/5">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg py-1 px-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-[0.97]"
            >
              <LogoMark size="sm" className="brightness-0 invert" />
              <span className="text-sm font-bold tracking-tight text-white">
                MAINTAIN
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
              <Link
                href="/dashboard"
                className="rounded px-2 py-1 transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:text-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="rounded px-2 py-1 transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:text-white"
              >
                Request Demo
              </button>
              <a
                href="#modules"
                className="rounded px-2 py-1 transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:text-white"
              >
                Modules
              </a>
              <a
                href="#pricing"
                className="rounded px-2 py-1 transition-colors hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:text-white"
              >
                Pricing
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Maintenance Operations Suite. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span className="cursor-pointer hover:text-white/60 transition-colors">
                Privacy Policy
              </span>
              <span className="cursor-pointer hover:text-white/60 transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================
          DEMO / WALKTHROUGH DRAWER WITH ACCESSIBLE FOCUS-VISIBLE INPUTS
          ================================================================ */}
      <Drawer
        open={demoOpen}
        onOpenChange={setDemoOpen}
        title="Request an Operations Walkthrough"
        description="Share your details and modules of interest. We will tailor a live demonstration to your facility."
        closeable={true}
        renderActions={
          <Button
            form="landing-demo-form"
            type="submit"
            variant="primary"
            className="active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2"
          >
            Submit Request
          </Button>
        }
        className="w-full sm:w-[45%] sm:min-w-[600px] sm:max-w-none lg:max-w-none"
      >
        <ScrollArea className="h-[calc(100vh-160px)] pr-4">
          <form
            id="landing-demo-form"
            onSubmit={handleDemoSubmit}
            className="flex flex-col gap-4 py-2"
          >
            <div className="group space-y-1.5">
              <label
                htmlFor="wt-name"
                className="text-xs font-semibold uppercase tracking-wider text-text-sub-600 transition-colors group-focus-within:text-text-strong-950"
              >
                Full Name
              </label>
              <input
                id="wt-name"
                name="name"
                required
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none transition-all duration-150 focus-visible:border-text-strong-950 focus-visible:ring-2 focus-visible:ring-text-strong-950/20"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="group space-y-1.5">
                <label
                  htmlFor="wt-email"
                  className="text-xs font-semibold uppercase tracking-wider text-text-sub-600 transition-colors group-focus-within:text-text-strong-950"
                >
                  Work Email
                </label>
                <input
                  id="wt-email"
                  name="email"
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none transition-all duration-150 focus-visible:border-text-strong-950 focus-visible:ring-2 focus-visible:ring-text-strong-950/20"
                />
              </div>
              <div className="group space-y-1.5">
                <label
                  htmlFor="wt-org"
                  className="text-xs font-semibold uppercase tracking-wider text-text-sub-600 transition-colors group-focus-within:text-text-strong-950"
                >
                  Company
                </label>
                <input
                  id="wt-org"
                  name="org"
                  required
                  placeholder="Apex Manufacturing"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none transition-all duration-150 focus-visible:border-text-strong-950 focus-visible:ring-2 focus-visible:ring-text-strong-950/20"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-sub-600">
                Modules of Interest
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SERVICES.map((m) => (
                  <label
                    key={m.num}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2.5 text-xs font-medium text-text-strong-950 transition-all duration-150 hover:bg-bg-weak-50 hover:border-stroke-sub-300 focus-within:ring-2 focus-within:ring-text-strong-950 focus-within:border-text-strong-950 outline-none"
                  >
                    <input
                      type="checkbox"
                      name="modules"
                      value={m.num}
                      defaultChecked={m.num === "01" || m.num === "02"}
                      className="size-3.5 rounded border-stroke-soft-200 text-primary-base focus:ring-0 outline-none"
                    />
                    <span>{m.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="group space-y-1.5">
              <label
                htmlFor="wt-notes"
                className="text-xs font-semibold uppercase tracking-wider text-text-sub-600 transition-colors group-focus-within:text-text-strong-950"
              >
                Notes (Optional)
              </label>
              <textarea
                id="wt-notes"
                name="notes"
                rows={3}
                placeholder="Team size, assets, integrations..."
                className="w-full resize-none rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none transition-all duration-150 focus-visible:border-text-strong-950 focus-visible:ring-2 focus-visible:ring-text-strong-950/20"
              />
            </div>
            <div className="rounded-xl border border-primary-base/20 bg-primary-lighter/40 p-3 text-xs text-primary-dark">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="size-4 shrink-0 text-primary-base" />
                <span>Instant Prototype Access</span>
              </div>
              <p className="mt-1 text-[11px] text-text-sub-600">
                Explore our live environment directly anytime via &quot;Launch
                workspace&quot;.
              </p>
            </div>
          </form>
        </ScrollArea>
      </Drawer>
    </div>
  );
}
