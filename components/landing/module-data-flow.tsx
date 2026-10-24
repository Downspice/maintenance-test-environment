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
  activeId?: string;
  onSelectModule?: (id: string) => void;
};

export default function ModuleDataFlow({
  className,
  activeId,
  onSelectModule,
}: ModuleDataFlowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-[250px] w-full sm:h-[280px]">
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 h-full w-full pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor="var(--color-primary-base)"
                stopOpacity="0.14"
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary-base)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r="76" fill="url(#hub-glow)" />

          {modules.map((mod, index) => {
            const isActive = activeId === mod.id;
            return (
              <g key={mod.id}>
                <path
                  d={pathToHub(mod.x, mod.y)}
                  className={cn(
                    "landing-flow-track transition-all duration-300",
                    isActive && "stroke-primary-base opacity-90"
                  )}
                  strokeWidth={isActive ? "2.5" : "1.5"}
                />
                <path
                  d={pathToHub(mod.x, mod.y)}
                  className={cn(
                    "landing-flow-pulse",
                    isActive && "stroke-primary-dark"
                  )}
                  strokeWidth={isActive ? "2.5" : "2"}
                  style={{ animationDelay: `${index * 0.35}s` }}
                />
                {!reduceMotion && (
                  <>
                    <circle
                      r={isActive ? 4 : 3.5}
                      fill="var(--color-primary-base)"
                    >
                      <animateMotion
                        dur={isActive ? "1.6s" : "2.2s"}
                        repeatCount="indefinite"
                        path={pathToHub(mod.x, mod.y)}
                        begin={`${index * 0.38}s`}
                      />
                    </circle>
                    <circle
                      r={isActive ? 3 : 2.5}
                      fill="var(--color-primary-dark)"
                    >
                      <animateMotion
                        dur={isActive ? "1.6s" : "2.2s"}
                        repeatCount="indefinite"
                        path={pathFromHub(mod.x, mod.y)}
                        begin={`${index * 0.38 + 1.1}s`}
                      />
                    </circle>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute left-1/2 top-[49%] z-[1] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center pointer-events-none">
          <div className="flex size-13 sm:size-15 items-center justify-center rounded-2xl border border-primary-base/30 bg-bg-white-0 shadow-regular-sm">
            <span className="text-center text-[10px] font-bold leading-tight text-primary-dark sm:text-[11px]">
              Shared
              <br />
              record
            </span>
          </div>
        </div>

        {modules.map((mod) => {
          const Icon = mod.icon;
          const isActive = activeId === mod.id;
          return (
            <div
              key={mod.id}
              className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                left: `${(mod.x / 400) * 100}%`,
                top: `${(mod.y / 300) * 100}%`,
              }}
            >
              <button
                type="button"
                onClick={() => onSelectModule?.(mod.id)}
                className={cn(
                  "flex size-9 sm:size-10 items-center justify-center rounded-xl border transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/40",
                  isActive
                    ? "border-primary-base bg-primary-lighter text-primary-dark shadow-regular-sm scale-110 ring-2 ring-primary-base/30"
                    : "border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:border-stroke-sub-300 hover:text-text-strong-950 hover:scale-105 shadow-regular-xs"
                )}
                title={mod.label}
                aria-label={`Select ${mod.label}`}
                aria-pressed={isActive}
              >
                <Icon className="size-4" strokeWidth={isActive ? 2.5 : 2} />
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[10px] font-semibold tracking-[0.14em] text-text-sub-600 uppercase sm:text-[11px]">
        Live operational data flow · Click node to inspect
      </p>
    </div>
  );
}
