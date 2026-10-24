import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/shared/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible lg:visible absolute top-[18px] -right-3 z-20">
      <Button
        onClick={() => setIsOpen?.()}
        className="size-6 rounded-full p-0 flex items-center justify-center bg-bg-white-0 hover:bg-bg-weak-50 text-text-sub-600 hover:text-text-strong-950 ring-1 ring-inset ring-stroke-soft-200 shadow-xs transition-colors"
        variant="ghost"
        aria-label={isOpen === false ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn(
            "size-3.5 transition-transform ease-in-out duration-300",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
