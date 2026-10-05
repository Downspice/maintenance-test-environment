"use client";

import { useReducedMotion } from "framer-motion";
import {
  BarChart,
  ClipboardList,
  Package,
  Store,
  Tractor,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/shared/utils";

type ModuleNode = {
  id: string;
  label: string;
  icon: LucideIcon;
  x: number;
  y: number;
};

const CX = 200;
const CY = 148;

const modules: ModuleNode[] = [
  { id: "wo", label: "Work orders", icon: ClipboardList, x: 200, y: 28 },
  { id: "eq", label: "Equipment", icon: Tractor, x: 338, y: 72 },
  { id: "inv", label: "Inventory", icon: Package, x: 338, y: 228 },
  { id: "wf", label: "Workforce", icon: Users, x: 200, y: 272 },
  { id: "ven", label: "Vendors", icon: Store, x: 62, y: 228 },
  { id: "ana", label: "Analytics", icon: BarChart, x: 62, y: 72 },
];

function pathToHub(x: number, y: number) {
  return `M ${x} ${y} L ${CX} ${CY}`;
}

function pathFromHub(x: number, y: number) {
  return `M ${CX} ${CY} L ${x} ${y}`;
}

type ModuleDataFlowProps = {
  className?: string;
};

export default function ModuleDataFlow({ className }: ModuleDataFlowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-[300px] w-full sm:h-[320px]" aria-hidden>
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary-base)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--color-primary-base)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY} r="76" fill="url(#hub-glow)" />

        {modules.map((mod, index) => (
          <g key={mod.id}>
            <path d={pathToHub(mod.x, mod.y)} className="landing-flow-track" strokeWidth="1.5" />
            <path
              d={pathToHub(mod.x, mod.y)}
              className="landing-flow-pulse"
              strokeWidth="2"
              style={{ animationDelay: `${index * 0.35}s` }}
            />
            {!reduceMotion && (
              <>
                <circle r="3.5" fill="var(--color-primary-base)">
                  <animateMotion
                    dur="2.2s"
                    repeatCount="indefinite"
                    path={pathToHub(mod.x, mod.y)}
                    begin={`${index * 0.38}s`}
                  />
                </circle>
                <circle r="2.5" fill="var(--color-primary-dark)">
                  <animateMotion
                    dur="2.2s"
                    repeatCount="indefinite"
                    path={pathFromHub(mod.x, mod.y)}
                    begin={`${index * 0.38 + 1.1}s`}
                  />
                </circle>
              </>
            )}
          </g>
        ))}
      </svg>

      <div className="absolute left-1/2 top-[49%] z-[1] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-primary-base/30 bg-bg-white-0 shadow-regular-sm sm:size-[4.25rem]">
          <span className="text-center text-[10px] font-bold leading-tight text-primary-dark sm:text-[11px]">
            Shared
            <br />
            record
          </span>
        </div>
      </div>

      {modules.map((mod) => {
        const Icon = mod.icon;
        return (
          <div
            key={mod.id}
            className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${(mod.x / 400) * 100}%`, top: `${(mod.y / 300) * 100}%` }}
            title={mod.label}
          >
            <div className="flex size-9 items-center justify-center rounded-xl border border-stroke-soft-200 bg-bg-white-0 text-primary-base shadow-regular-xs sm:size-10">
              <Icon className="size-4" strokeWidth={2} />
            </div>
          </div>
        );
      })}

      </div>
      <p className="mt-6 text-center text-[10px] font-semibold tracking-[0.14em] text-text-sub-600 uppercase sm:mt-8 sm:text-[11px]">
        Data flows through every module
      </p>
    </div>
  );
}
