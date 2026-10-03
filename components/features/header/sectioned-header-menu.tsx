"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

export type HeaderMenuSection<T extends string = string> = {
  label: string;
  items: {
    id: T;
    label: string;
    icon?: LucideIcon;
    emphasize?: boolean;
  }[];
};

type SectionedHeaderMenuProps<T extends string> = {
  trigger: ReactNode;
  sections: HeaderMenuSection<T>[];
  onSelect: (id: T) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  contentClassName?: string;
};

export function SectionedHeaderMenu<T extends string>({
  trigger,
  sections,
  onSelect,
  align = "end",
  side = "bottom",
  contentClassName,
}: SectionedHeaderMenuProps<T>) {
  const handleSelect = (id: T) => {
    window.setTimeout(() => onSelect(id), 0);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={8}
        className={cn(
          "w-[min(100vw-2rem,17.5rem)] rounded-xl p-1.5",
          contentClassName
        )}
      >
        {sections.map((section, sectionIndex) => (
          <DropdownMenuGroup key={section.label}>
            {sectionIndex > 0 && <DropdownMenuSeparator className="my-1.5" />}
            <DropdownMenuLabel className="px-2 pb-1 pt-1.5">
              {section.label}
            </DropdownMenuLabel>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={cn(
                    "whitespace-normal py-2 leading-snug",
                    item.emphasize && "font-medium"
                  )}
                  onSelect={() => handleSelect(item.id)}
                >
                  {Icon ? (
                    <Icon className="size-4 shrink-0 text-text-soft-400" />
                  ) : null}
                  <span className="text-text-strong-950">{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
