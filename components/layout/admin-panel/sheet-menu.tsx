import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/layout/admin-panel/menu";
import { LogoMark } from "@/components/landing/logo-mark";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-64 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="w-full h-auto p-0 pb-2 pt-1 justify-center hover:no-underline"
            variant="link"
            asChild
          >
            <Link
              href="/dashboard"
              className="flex flex-col items-center justify-center gap-1.5 w-full group"
            >
              <LogoMark
                size="lg"
                priority
                className="shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              <SheetTitle className="text-xs font-medium tracking-tight text-text-sub-600 dark:text-zinc-400 whitespace-nowrap">
                Maintenance Operations
              </SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
