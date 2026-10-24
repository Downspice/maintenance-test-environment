"use client";

import { useState } from "react";
import { cn } from "@/lib/shared/utils";
import { ClipboardList, CalendarClock, Package, BarChart3 } from "lucide-react";

const steps = [
  {
    id: 0,
    kicker: "Work orders",
    title: "Jobs that close themselves out",
    body: "Technicians receive assignments, follow checklists, and capture photos on site. Completed work updates equipment history and inventory immediately.",
    icon: ClipboardList,
    mock: {
      title: "WO-1842 · Conveyor belt",
      lines: [
        { label: "Assigned", value: "North crew · 09:14" },
        { label: "Status", value: "In progress", accent: true },
        { label: "Parts reserved", value: "Belt kit × 1" },
      ],
    },
  },
  {
    id: 1,
    kicker: "Preventive maintenance",
    title: "PM schedules that never slip",
    body: "Meter readings and run-hours trigger work automatically. Supervisors see what's due this week before it becomes downtime.",
    icon: CalendarClock,
    mock: {
      title: "PM calendar · Building A",
      lines: [
        { label: "Due today", value: "3 inspections", accent: true },
        { label: "Next 7 days", value: "11 tasks" },
        { label: "Overdue", value: "0" },
      ],
    },
  },
  {
    id: 2,
    kicker: "Inventory",
    title: "Parts on hand when crews arrive",
    body: "Stock levels tie to work orders and vendors. Purchase orders raise themselves when bins hit reorder points.",
    icon: Package,
    mock: {
      title: "Stock · Line 4 storeroom",
      lines: [
        { label: "SKU 4401", value: "12 on hand" },
        { label: "Reserved", value: "2 for WO-1842", accent: true },
        { label: "Reorder", value: "Not required" },
      ],
    },
  },
  {
    id: 3,
    kicker: "Analytics",
    title: "Dashboards that surface risk early",
    body: "MTBF, backlog, and spend roll up in real time so leadership acts on trends — not end-of-month surprises.",
    icon: BarChart3,
    mock: {
      title: "Ops overview · Live",
      lines: [
        { label: "Open WOs", value: "47", accent: true },
        { label: "PM compliance", value: "96.2%" },
        { label: "Critical assets", value: "3 flagged" },
      ],
    },
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  const Icon = step.icon;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <div className="space-y-3">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(idx)}
            className={cn(
              "w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 sm:px-5 sm:py-5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40",
              idx === active
                ? "border-primary-base/30 bg-bg-white-0 shadow-regular-md"
                : "border-stroke-soft-200 bg-bg-weak-50/80 hover:border-stroke-sub-300 hover:bg-bg-white-0"
            )}
            aria-pressed={idx === active}
          >
            <p className="text-xs font-semibold tracking-wide text-text-sub-600 uppercase">
              {idx + 1} · {s.kicker}
            </p>
            <p className="mt-1 text-base font-semibold text-text-strong-950 sm:text-lg">
              {s.title}
            </p>
            {idx === active && (
              <p className="mt-2 text-sm leading-relaxed text-text-sub-600">
                {s.body}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-lighter via-transparent to-bg-weak-50" />
        <div className="relative w-full max-w-md rounded-3xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-md sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-lighter text-primary-base">
              <Icon className="size-5" strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-sub-600 uppercase">
                Live preview
              </p>
              <p className="text-sm font-semibold text-text-strong-950">
                {step.mock.title}
              </p>
            </div>
          </div>
          <ul className="space-y-4">
            {step.mock.lines.map((line) => (
              <li
                key={line.label}
                className="flex items-center justify-between border-b border-stroke-soft-200 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm text-text-sub-600">{line.label}</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    line.accent ? "text-primary-base" : "text-text-strong-950"
                  )}
                >
                  {line.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
