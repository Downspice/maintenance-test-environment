"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  LayoutGrid,
  Shield,
  Plug,
  MapPin,
  ClipboardList,
  Tractor,
  Package,
  Users,
  Store,
  BarChart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LogoWordmark } from "@/components/landing/logo-mark";
import ModuleDataFlow from "@/components/landing/module-data-flow";
import { LogoMark } from "@/components/landing/logo-mark";
import HowItWorks from "@/components/landing/how-it-works";
import { cn } from "@/lib/shared/utils";

const navLinks = [
  { href: "#platform", label: "Platform" },
  { href: "#products", label: "Products" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

const marqueeItems = [
  { icon: LayoutGrid, title: "Modular suite", subtitle: "Deploy one module or all six" },
  { icon: Shield, title: "Fully auditable", subtitle: "Every action recorded" },
  { title: "Live sync", subtitle: "Shared records across modules" },
  { title: "Field ready", subtitle: "Work orders on any device" },
  { title: "MAINTAIN", subtitle: "Maintenance operations suite" },
];

const modules = [
  {
    icon: ClipboardList,
    name: "Work Orders",
    tag: "Execution",
    description: "Route, assign, and close maintenance jobs with full traceability.",
  },
  {
    icon: Tractor,
    name: "Equipment",
    tag: "Assets",
    description: "Lifecycle history, PM schedules, and downtime in one register.",
  },
  {
    icon: Package,
    name: "Inventory",
    tag: "Parts",
    description: "Stock, reservations, and usage tied to the work that consumes them.",
  },
  {
    icon: Users,
    name: "Workforce",
    tag: "People",
    description: "Crews, skills, and schedules aligned to operational demand.",
  },
  {
    icon: Store,
    name: "Vendors",
    tag: "Supply",
    description: "Suppliers and purchase orders integrated into procurement flows.",
  },
  {
    icon: BarChart,
    name: "Analytics",
    tag: "Insight",
    description: "Dashboards and reports built on the same live operational data.",
  },
];

const foundations = [
  {
    icon: Shield,
    title: "Complete audit trails",
    body: "Every adjustment, assignment, and approval is recorded with who, what, and when.",
  },
  {
    icon: Users,
    title: "Identity and access",
    body: "Role-based permissions enforced consistently across every module.",
  },
  {
    icon: Plug,
    title: "Open integration",
    body: "API-ready patterns for ERP, accounting, and external asset systems.",
  },
  {
    icon: MapPin,
    title: "Location aware",
    body: "Sites, assets, and crews share one operational map from planning to close-out.",
  },
];

const faqs = [
  {
    q: "What is Maintenance OS?",
    a: "An integrated maintenance and operations workspace that combines work orders, equipment, inventory, vendors, workforce, and analytics on one shared record set.",
  },
  {
    q: "Do we have to adopt every module?",
    a: "No. Start with the module you need today and add others as you grow. New modules reuse the same assets, parts, and people records.",
  },
  {
    q: "Can this work with our existing systems?",
    a: "Yes. The suite is designed to run alongside ERP and accounting tools you are not ready to replace, with export and integration paths as you mature.",
  },
  {
    q: "Is there a mobile experience?",
    a: "Yes. Technicians can receive and update work orders from phones and tablets; every web module is responsive for floor and field use.",
  },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    alt: "Technician reviewing equipment",
    rotate: "-rotate-6",
  },
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    alt: "Industrial facility",
    rotate: "rotate-3",
  },
  {
    src: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=600&q=80",
    alt: "Maintenance planning",
    rotate: "-rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80",
    alt: "Field service",
    rotate: "rotate-6",
  },
];

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false);

  function handleDemoSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Thanks — we'll tailor a walkthrough to your operation.");
    e.currentTarget.reset();
  }

  return (
    <div
      className="landing-page min-h-screen font-sans text-text-strong-950 antialiased"
      style={{ background: "var(--gradient-background)" }}
    >
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-stroke-soft-200 bg-bg-white-0/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="shrink-0">
            <LogoWordmark priority />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-sub-600 transition-colors hover:text-text-strong-950"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="md" asChild>
              <Link href="/dashboard">Sign in</Link>
            </Button>
            <Button size="md" variant="primary" asChild>
              <Link href="/dashboard">Open workspace</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-stroke-soft-200 md:hidden"
            aria-label={mobileNav ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileNav((o) => !o)}
          >
            {mobileNav ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileNav && (
          <div className="border-t border-stroke-soft-200 px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-sub-600"
                  onClick={() => setMobileNav(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link href="/dashboard" className="text-sm font-semibold text-primary-base">
                Sign in / Open workspace
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stroke-soft-200/80">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,var(--color-primary-alpha-16),transparent)]"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <LogoMark size="lg" priority className="mb-8" />

            <div className="mb-6 inline-flex items-center rounded-full border border-stroke-soft-200 bg-bg-white-0/90 px-4 py-1.5 text-sm text-text-sub-600 shadow-regular-xs">
              <span className="mr-2 inline-block size-2 rounded-full bg-primary-base" />
              One suite for the maintenance value chain
            </div>

            <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
              Run the entire operation{" "}
              <span className="text-primary-base">from one platform.</span>
            </h1>
            <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-text-sub-600">
              Work orders, equipment, inventory, vendors, and analytics share one record — so
              planners, crews, and leadership always see the same truth.
            </p>

            <div className="mt-10 flex w-full flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button size="lg" variant="primary" className="min-w-[180px]" asChild>
                <Link href="/dashboard">Open workspace</Link>
              </Button>
              <Button size="lg" variant="secondary" className="min-w-[180px]" asChild>
                <a href="#contact">Request a walkthrough</a>
              </Button>
            </div>
          </div>

          <ModuleDataFlow className="mx-auto w-full max-w-md lg:max-w-none" />
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-stroke-soft-200 bg-bg-white-0/60 py-5" aria-label="Platform highlights">
        <div className="landing-marquee-mask overflow-hidden">
          <ul className="landing-marquee-track flex w-max gap-10 px-6">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <li key={`${item.title}-${i}`} className="flex min-w-[220px] items-center gap-3">
                {item.icon ? (
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary-lighter text-primary-base">
                    <item.icon className="size-4" />
                  </span>
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-bg-weak-50 text-xs font-bold text-text-sub-600">
                    {item.title.slice(0, 2)}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-text-strong-950">{item.title}</p>
                  <p className="text-xs text-text-sub-600">{item.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Built for */}
      <section id="platform" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built for operations, from shop floor to boardroom.
          </h2>
          <p className="mt-4 text-lg text-text-sub-600">
            From assets and PM schedules to storerooms, field crews, and leadership dashboards —
            Maintenance OS keeps every part of the operation connected.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-5xl flex-wrap items-center justify-center gap-4 px-5 sm:gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.src}
              className={cn(
                "h-44 w-36 overflow-hidden rounded-2xl border border-stroke-soft-200 shadow-lg sm:h-52 sm:w-44",
                img.rotate
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="scroll-mt-24 border-t border-stroke-soft-200 bg-bg-white-0/50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
            One workspace. Six modules.
          </h2>
          <p className="mt-4 text-lg text-text-sub-600">
            Shared records power every module — deploy one today or grow into the full suite.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.name}
                href="/dashboard"
                className="group rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-base/30 hover:shadow-regular-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-bg-weak-50 text-text-sub-600 transition-colors group-hover:bg-primary-lighter group-hover:text-primary-base">
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-full bg-bg-weak-50 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-text-sub-600 uppercase">
                    {mod.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-strong-950">{mod.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-sub-600">{mod.description}</p>
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-base">
                  Explore
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* One record */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
            One record. Every team. No reconciling between systems.
          </h2>
          <p className="mt-4 text-lg text-text-sub-600">
            Point solutions each keep their own copy of the asset and the job. Maintenance OS keeps
            one — and every module reads from it.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-6 px-5 sm:grid-cols-3 sm:px-8">
          {[
            {
              title: "Assets captured once",
              body: "Equipment registered in the hub is immediately available for work orders, PM, and inventory reservations.",
            },
            {
              title: "Work becomes history",
              body: "Closed jobs update asset timelines and parts usage automatically — no exports or batch uploads.",
            },
            {
              title: "Every change traced",
              body: "One audit trail spans assignments, stock movements, and approvals for reviews and compliance.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-text-strong-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-sub-600">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-stroke-soft-200 bg-bg-white-0/50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
            Connected from the control room to the shop floor.
          </h2>
          <p className="mt-4 text-lg text-text-sub-600">
            The same records power the apps your technicians, planners, and leaders use every day.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
          <HowItWorks />
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
            Enterprise foundations, built in.
          </h2>
          <p className="mt-4 text-lg text-text-sub-600">
            Security, integration, and traceability live in the shared core — so every module
            inherits them from day one.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
          {foundations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-sm"
              >
                <Icon className="size-5 text-primary-base" />
                <h3 className="mt-4 text-base font-semibold text-text-strong-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-sub-600">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24 border-t border-stroke-soft-200 bg-bg-white-0/50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-center text-text-sub-600">
            Have a question about your operation?{" "}
            <a href="#contact" className="font-medium text-primary-base hover:underline">
              Talk to our team.
            </a>
          </p>
          <Accordion type="single" collapsible className="mt-10 rounded-2xl border border-stroke-soft-200 bg-bg-white-0 px-4 sm:px-6">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2 lg:gap-16 sm:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-text-strong-950 sm:text-4xl">
              See Maintenance OS on your own data.
            </h2>
            <p className="mt-4 text-lg text-text-sub-600">
              Tell us about your sites and the modules you are evaluating. We will tailor a
              walkthrough to your assets, crews, and inventory.
            </p>
            <Button size="lg" variant="primary" className="mt-8" asChild>
              <Link href="/dashboard">
                Jump into the live workspace
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <form
            onSubmit={handleDemoSubmit}
            className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-sub-600">
                Full name *
                <input
                  required
                  name="name"
                  className="mt-1.5 w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
                />
              </label>
              <label className="block text-sm font-medium text-text-sub-600">
                Organisation *
                <input
                  required
                  name="org"
                  className="mt-1.5 w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
                />
              </label>
              <label className="block text-sm font-medium text-text-sub-600">
                Work email *
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-1.5 w-full rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
                />
              </label>
              <label className="block text-sm font-medium text-text-sub-600">
                What would you like to see?
                <textarea
                  name="message"
                  rows={3}
                  className="mt-1.5 w-full resize-none rounded-xl border border-stroke-soft-200 px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40"
                />
              </label>
              <Button type="submit" variant="primary" className="w-full">
                Send request
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stroke-soft-200 bg-foreground py-16 text-primary-foreground sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to run maintenance on one platform?
          </h2>
          <p className="mt-4 text-lg text-white/65">
            Start with the module you need today and grow into the full suite.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="primary" className="min-w-[180px]" asChild>
              <Link href="/dashboard">Open workspace</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="min-w-[180px] border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/15"
              asChild
            >
              <a href="#contact">Request a walkthrough</a>
            </Button>
          </div>
          <p className="mt-8 text-sm text-white/45">One workspace. Six modules. Every record shared.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stroke-soft-200 bg-bg-white-0 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">
          <div>
            <LogoWordmark compact />
            <p className="mt-4 text-sm leading-relaxed text-text-sub-600">
              Work orders, assets, inventory, and analytics for modern maintenance teams — on one
              shared core.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-strong-950">Products</h4>
            <ul className="mt-3 space-y-2 text-sm text-text-sub-600">
              {modules.map((m) => (
                <li key={m.name}>
                  <Link href="/dashboard" className="hover:text-primary-base">
                    {m.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-strong-950">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-text-sub-600">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-primary-base">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text-strong-950">Sign in</h4>
            <p className="mt-3 text-sm text-text-sub-600">
              Open the live workspace to explore dashboards, work orders, and inventory.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex text-sm font-semibold text-primary-base hover:underline"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-5 text-center text-xs text-text-soft-400 sm:px-8">
          © {new Date().getFullYear()} Maintenance OS. Prototype environment.
        </p>
      </footer>
    </div>
  );
}
