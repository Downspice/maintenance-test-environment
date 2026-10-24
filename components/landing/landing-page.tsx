"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  motion,
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
  Sparkles,
  CheckCircle2,
  Menu,
  X,
  Wrench,
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
import { LogoWordmark } from "@/components/landing/logo-mark";
import { LogoMark } from "@/components/landing/logo-mark";
import { cn } from "@/lib/shared/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   EASING & ANIMATION HELPERS
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
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
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

const PLAN_FEATURES = [
  "Unlimited work orders",
  "Equipment & asset registry",
  "Inventory management",
  "Workforce scheduling",
  "Vendor & procurement",
  "Analytics dashboards",
  "Mobile field access",
  "API & ERP integration",
  "Dedicated onboarding",
  "Priority support",
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS
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
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="shrink-0 flex items-center gap-2.5">
          <LogoMark size="sm" className="brightness-0 invert" priority />
          <span className="text-base font-bold tracking-tight text-white">
            MAINTAIN
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {["Home", "Modules", "Process", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-sm text-white/70 hover:text-white hover:bg-white/5 sm:inline-flex"
            asChild
          >
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <button
            type="button"
            onClick={onRequestDemo}
            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-white/90 sm:inline-flex"
          >
            Get Started
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 hover:text-white md:hidden"
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
      {mobileOpen && (
        <div className="border-t border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {["Home", "Modules", "Process", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="rounded-lg px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="ghost" size="sm" className="text-white/70 justify-start" asChild>
                <Link href="/dashboard">Sign in</Link>
              </Button>
              <button
                type="button"
                onClick={() => {
                  onRequestDemo();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#0a0a0a]"
              >
                Get Started
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE ACCORDION
   ─────────────────────────────────────────────────────────────────────────── */
function ServiceAccordion() {
  const [activeIdx, setActiveIdx] = useState(0);

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
                "group flex items-center gap-4 border-b border-white/10 py-5 text-left transition-all duration-300",
                isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <span className="font-serif text-lg italic text-white/50">
                ({svc.num})
              </span>
              <span className="text-lg font-medium text-white sm:text-xl">
                {svc.title}
              </span>
              <ChevronRight
                className={cn(
                  "ml-auto size-5 text-white/40 transition-transform duration-300",
                  isActive && "rotate-90 text-white"
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Right: detail panel */}
      <div className="relative flex flex-col justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
          {(() => {
            const svc = SERVICES[activeIdx];
            const Icon = svc.icon;
            return (
              <>
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <Icon className="size-6 text-white/80" />
                </div>
                <p className="mb-6 text-sm leading-relaxed text-white/60 sm:text-base">
                  {svc.description}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {svc.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-white/40" />
                      {feat}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
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
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
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
          1. HERO — Full-screen dark with background image
          ================================================================ */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#0a0a0a]"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-hero-bg.jpg"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/80" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pt-24 pb-12 lg:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <motion.h1
              className="text-[clamp(3rem,10vw,9rem)] font-bold leading-[0.9] tracking-tighter text-white"
              initial={reduceMotion ? false : { opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
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
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.6 }}
        >
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Left description */}
            <div className="max-w-md">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/50">
                <Sparkles className="size-3.5" />
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

            {/* Right: numbered features */}
            <div className="flex flex-col gap-1 text-right">
              {[
                { n: "01", label: "Work Order Management" },
                { n: "02", label: "Equipment Tracking" },
                { n: "03", label: "Inventory Control" },
                { n: "04", label: "Workforce Coordination" },
              ].map((item) => (
                <div
                  key={item.n}
                  className="flex items-center justify-end gap-3 text-sm text-white/80"
                >
                  <span className="font-serif italic text-white/40">
                    ({item.n})
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
              <Link
                href="/dashboard"
                className="mt-4 inline-flex items-center gap-2 self-end rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#0a0a0a]"
              >
                Launch workspace
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================================================================
          2. ABOUT / MISSION — Light section with large centered text
          ================================================================ */}
      <section className="relative overflow-hidden bg-[#f5f5f3] px-6 py-32 lg:px-10 lg:py-44">
        {/* Subtle diagonal lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            #000 80px,
            #000 81px
          )`,
        }} />

        <div className="relative mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-8 flex items-center justify-between text-xs text-[#1a1a1a]/40">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5" />
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
              <div className="flex items-center gap-3 rounded-xl border border-[#1a1a1a]/10 bg-white/60 px-5 py-3 backdrop-blur-sm">
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
              <div className="flex items-center gap-3 rounded-xl border border-[#1a1a1a]/10 bg-white/60 px-5 py-3 backdrop-blur-sm">
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
          3. ABOUT DETAIL — Light + image + description text
          ================================================================ */}
      <section className="bg-[#f5f5f3] px-6 pb-24 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="relative mx-auto aspect-[16/7] max-w-4xl overflow-hidden rounded-2xl border border-[#1a1a1a]/5 shadow-2xl">
              <Image
                src="/landing-team-bg.jpg"
                alt="Operations center"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 backdrop-blur-md">
                  <LogoMark size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Discuss your operations
                    </p>
                    <p className="text-xs text-white/60">
                      Speak with the team lead
                    </p>
                  </div>
                </div>
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
                className="inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#333]"
              >
                View our platform
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ================================================================
          4. SERVICES — Dark section with accordion
          ================================================================ */}
      <section
        id="modules"
        className="relative overflow-hidden bg-[#0f0f0f] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center gap-2 text-sm text-white/40">
              <Sparkles className="size-3.5" />
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
          5. PROCESS — Light section with step cards
          ================================================================ */}
      <section id="process" className="relative bg-[#f5f5f3] px-6 py-24 lg:px-10 lg:py-32">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            #000 80px,
            #000 81px
          )`,
        }} />

        <div className="relative mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-[#1a1a1a]/40">
              <Sparkles className="size-3.5" />
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
                <FadeUp key={step.title} delay={0.15 + i * 0.1}>
                  <div className="group rounded-2xl border border-[#1a1a1a]/5 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#1a1a1a]/10 hover:shadow-xl sm:p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <div className="flex items-center gap-1">
                        {[...Array(3)].map((_, j) => (
                          <Sparkles
                            key={j}
                            className={cn(
                              "text-[#1a1a1a]/20",
                              j === 0 ? "size-4" : j === 1 ? "size-3" : "size-2.5"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#f5f5f3]">
                      <Icon className="size-8 text-[#1a1a1a]/50" />
                    </div>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/60">
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
          6. METRICS — Light section with big numbers (Ignitex style)
          ================================================================ */}
      <section className="bg-[#f5f5f3] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left text */}
            <div>
              <FadeUp>
                <div className="mb-4 flex items-center gap-2 text-sm text-[#1a1a1a]/40">
                  <Sparkles className="size-3.5" />
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
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#333]"
                >
                  Know more about us
                  <ArrowRight className="size-4" />
                </Link>
              </FadeUp>
            </div>

            {/* Right metric rows */}
            <div className="flex flex-col">
              {METRICS.map((metric, i) => (
                <FadeUp key={metric.value} delay={0.15 + i * 0.08}>
                  <div
                    className={cn(
                      "flex items-center gap-6 py-6",
                      i < METRICS.length - 1 && "border-b border-[#1a1a1a]/10"
                    )}
                  >
                    <p className="shrink-0 text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-tight">
                      {metric.value}
                      <span className="font-serif text-[0.65em] italic font-normal text-[#1a1a1a]/50">
                        {metric.suffix}
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed text-[#1a1a1a]/60">
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
          7. PRICING — Dark section
          ================================================================ */}
      <section
        id="pricing"
        className="relative overflow-hidden bg-[#0f0f0f] px-6 py-24 lg:px-10 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px]">
          <FadeUp>
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-white/40">
              <Sparkles className="size-3.5" />
              <span>No hidden fees</span>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="mb-16 text-center text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1] tracking-tight text-white">
              Clear{" "}
              <span className="font-serif italic font-normal text-white/60">
                Pricing,
              </span>{" "}
              clear
              <br />
              results
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              {/* Plan card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Operations Suite
                    </h3>
                    <p className="mt-1 text-sm text-white/50">
                      Ideal for facilities needing full maintenance coverage.
                    </p>
                  </div>
                  <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                        billingCycle === "monthly"
                          ? "bg-white text-[#0a0a0a]"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("annual")}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                        billingCycle === "annual"
                          ? "bg-white text-[#0a0a0a]"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      Annual
                    </button>
                  </div>
                </div>

                <div className="mb-6 border-t border-white/10 pt-6">
                  <p className="mb-3 text-xs font-medium tracking-wider text-white/40 uppercase">
                    What&apos;s included
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PLAN_FEATURES.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2 text-sm text-white/70"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-white/30" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-white">
                    {billingCycle === "monthly" ? "$299" : "$249"}
                  </span>
                  <span className="mb-1 text-sm text-white/40">
                    /month {billingCycle === "annual" && "(billed annually)"}
                  </span>
                </div>
              </div>

              {/* CTA card */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-white/5">
                  <LogoMark size="sm" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400">
                    3 Spots Available
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  Schedule a discovery call
                </h3>
                <p className="mb-6 text-sm text-white/50">
                  Let&apos;s connect and see how we can bring your vision to
                  life.
                </p>
                <button
                  type="button"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-white/90"
                >
                  Book a call
                  <ArrowRight className="size-4" />
                </button>
              </div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/40 to-transparent" />
        </div>

        <div className="relative z-10 flex min-h-[80vh] flex-col justify-between px-6 py-16 lg:px-10">
          <div className="mx-auto w-full max-w-[1400px]">
            <FadeUp>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <Sparkles className="size-3.5" />
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
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] transition-all hover:bg-white/90"
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
      <footer className="bg-[#0a0a0a] px-6 py-12 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <LogoMark size="sm" className="brightness-0 invert" />
              <span className="text-sm font-bold tracking-tight text-white">
                MAINTAIN
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
              <Link
                href="/dashboard"
                className="transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="transition-colors hover:text-white"
              >
                Request Demo
              </button>
              <a href="#modules" className="transition-colors hover:text-white">
                Modules
              </a>
              <a href="#pricing" className="transition-colors hover:text-white">
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
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================
          DEMO / WALKTHROUGH DRAWER
          ================================================================ */}
      <Drawer
        open={demoOpen}
        onOpenChange={setDemoOpen}
        title="Request an Operations Walkthrough"
        description="Share your details and modules of interest. We will tailor a live demonstration to your facility."
        closeable={true}
        renderActions={
          <Button form="landing-demo-form" type="submit" variant="primary">
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
            <div className="space-y-1.5">
              <label
                htmlFor="wt-name"
                className="text-xs font-semibold uppercase tracking-wider text-text-sub-600"
              >
                Full Name
              </label>
              <input
                id="wt-name"
                name="name"
                required
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="wt-email"
                  className="text-xs font-semibold uppercase tracking-wider text-text-sub-600"
                >
                  Work Email
                </label>
                <input
                  id="wt-email"
                  name="email"
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="wt-org"
                  className="text-xs font-semibold uppercase tracking-wider text-text-sub-600"
                >
                  Company
                </label>
                <input
                  id="wt-org"
                  name="org"
                  required
                  placeholder="Apex Manufacturing"
                  className="w-full rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
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
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-2 text-xs font-medium text-text-strong-950 hover:bg-bg-weak-50"
                  >
                    <input
                      type="checkbox"
                      name="modules"
                      value={m.num}
                      defaultChecked={m.num === "01" || m.num === "02"}
                      className="size-3.5 rounded border-stroke-soft-200 text-primary-base focus:ring-primary-base/40"
                    />
                    <span>{m.title}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="wt-notes"
                className="text-xs font-semibold uppercase tracking-wider text-text-sub-600"
              >
                Notes (Optional)
              </label>
              <textarea
                id="wt-notes"
                name="notes"
                rows={3}
                placeholder="Team size, assets, integrations..."
                className="w-full resize-none rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-3.5 py-2.5 text-sm text-text-strong-950 placeholder:text-text-soft-400 outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
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
