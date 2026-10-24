"use client";

import * as React from "react";

import { useSidebar } from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <div className="bg-sidebar-accent  text-sidebar-accent-foreground flex p-5">
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-large">
          Maintenance test Environment
        </span>
        <span className="truncate text-xs"> </span>
      </div>
    </div>
  );
}
