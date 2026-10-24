"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/shared/utils";
import { getMenuList } from "@/lib/shared/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/layout/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <ScrollArea className="flex-1 min-h-0 w-full h-[calc(100vh-140px)] [&>div>div[style]]:!block">
      <nav className="w-full">
        <ul className="flex flex-col items-start space-y-1 px-1 w-full">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
              {menus.map(
                (
                  { href, label, icon: Icon, active, submenus, button },
                  index
                ) => {
                  const isActive =
                    (active === undefined &&
                      (href === "/dashboard"
                        ? pathname === "/dashboard" || pathname === "/"
                        : pathname === href ||
                          pathname.startsWith(href + "/"))) ||
                    active;

                  return !submenus || submenus.length === 0 ? (
                    <div
                      className="w-full relative flex items-center mb-1"
                      key={index}
                    >
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full h-10 transition-colors duration-150",
                                isOpen === false
                                  ? "justify-center px-0"
                                  : "justify-start px-3",
                                isActive
                                  ? "bg-gray-100 text-text-strong-950 font-semibold dark:bg-zinc-800 dark:text-zinc-50"
                                  : "text-text-sub-600 hover:bg-gray-50 hover:text-text-strong-950 dark:hover:bg-zinc-800/50"
                              )}
                              asChild
                            >
                              <Link
                                href={href}
                                className={cn(
                                  "flex items-center w-full",
                                  isOpen === false
                                    ? "justify-center"
                                    : "justify-start",
                                  isOpen && button ? "pr-8" : ""
                                )}
                              >
                                {/* Icon and Label */}
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className={cn(
                                      isOpen === false ? "" : "shrink-0"
                                    )}
                                  >
                                    <Icon size={18} />
                                  </span>
                                  <p
                                    className={cn(
                                      "truncate text-sm",
                                      isOpen === false
                                        ? "-translate-x-96 opacity-0 hidden"
                                        : "translate-x-0 opacity-100"
                                    )}
                                  >
                                    {label}
                                  </p>
                                </div>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>

                      {/* Plus button */}
                      {isOpen && button && (
                        <div
                          className="absolute right-2 shrink-0 flex items-center justify-center z-10 [&_button]:size-6 [&_button]:p-0 [&_button]:h-6 [&_button]:w-6 [&_button]:rounded-md [&_button]:text-text-soft-400 hover:[&_button]:text-text-strong-950 hover:[&_button]:bg-gray-200/70 dark:hover:[&_button]:bg-zinc-700 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {button}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={isActive}
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  );
                }
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
