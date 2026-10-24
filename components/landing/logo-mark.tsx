import Image from "next/image";
import { cn } from "@/lib/shared/utils";

type LogoMarkProps = {
  className?: string;
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
  variant?: "default" | "white" | "black";
  priority?: boolean;
};

const heights = {
  "2xs": 12,
  xs: 15,
  sm: 32,
  md: 40,
  lg: 56,
};

export function LogoMark({
  className,
  size = "md",
  variant = "default",
  priority = false,
}: LogoMarkProps) {
  const height = heights[size];
  const variantClass =
    variant === "white"
      ? "brightness-0 invert"
      : variant === "black"
      ? "brightness-0"
      : "";

  return (
    <Image
      src="/brand-logo.png"
      alt="Maintenance operations"
      width={139}
      height={169}
      priority={priority}
      className={cn("w-auto shrink-0 object-contain", variantClass, className)}
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
