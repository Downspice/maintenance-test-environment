"use client";
import { Menu } from "@/components/layout/admin-panel/menu";
import { SidebarToggle } from "@/components/layout/admin-panel/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/shared/utils";
import { LogoMark } from "@/components/landing/logo-mark";
import Link from "next/link";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[72px]" : "w-64",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-1 py-4 overflow-y-auto border-r border-stroke-soft-200"
      >
        <Button
          className="w-full h-auto p-0 mb-3 justify-center hover:no-underline"
          variant="link"
          asChild
        >
          <Link
            href="/dashboard"
            className="flex flex-col items-center justify-center gap-1.5 w-full py-1 hover:no-underline group"
          >
            <LogoMark
              size={!getOpenState() ? "md" : "lg"}
              priority
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            <span
              className={cn(
                "text-xs font-medium tracking-tight text-text-sub-600 dark:text-zinc-400 whitespace-nowrap transition-[opacity,transform,display] duration-300",
                !getOpenState()
                  ? "opacity-0 -translate-y-1 pointer-events-none hidden"
                  : "opacity-100 translate-y-0"
              )}
            >
              Maintenance Operations
            </span>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
