import Image from "next/image";
import { cn } from "@/lib/shared/utils";

type LogoMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const heights = {
  sm: 32,
  md: 40,
  lg: 56,
};

export function LogoMark({ className, size = "md", priority = false }: LogoMarkProps) {
  const height = heights[size];

  return (
    <Image
      src="/brand-logo.png"
      alt="Maintenance operations"
      width={139}
      height={169}
      priority={priority}
      className={cn("w-auto shrink-0 object-contain", className)}
      style={{ height, width: "auto" }}
    />
  );
}

export function LogoWordmark({ compact, priority }: { compact?: boolean; priority?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <LogoMark size={compact ? "sm" : "md"} priority={priority} />
      <div className="leading-tight">
        <p className="text-[15px] font-bold tracking-tight text-text-strong-950 sm:text-base">MAINTAIN</p>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-text-sub-600 uppercase sm:text-[11px]">
          Operations Suite
        </p>
      </div>
    </div>
  );
}
