"use client";

import { KeyRound, Settings, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import {
  SectionedHeaderMenu,
  type HeaderMenuSection,
} from "./header/sectioned-header-menu";

type ProfileMenuId = "user-preferences" | "manage-users" | "change-password";

const PROFILE_MENU_SECTIONS: HeaderMenuSection<ProfileMenuId>[] = [
  {
    label: "Account",
    items: [
      {
        id: "user-preferences",
        label: "User preferences",
        icon: Settings,
      },
    ],
  },
  {
    label: "Security & admin",
    items: [
      { id: "manage-users", label: "Manage users", icon: Users },
      { id: "change-password", label: "Change password", icon: KeyRound },
    ],
  },
];

export default function HeaderProfileButton() {
  const handleSelect = (id: ProfileMenuId) => {
    toast.info(`"${id.replace(/-/g, " ")}" — coming soon`);
  };

  return (
    <SectionedHeaderMenu
      sections={PROFILE_MENU_SECTIONS}
      onSelect={handleSelect}
      trigger={
        <Button variant="secondary" className="max-w-[12rem] gap-2 px-2">
          <Avatar size="sm">
            <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
            <AvatarFallback>YS</AvatarFallback>
          </Avatar>
          <span className="truncate text-nowrap">Mr. Yaw Sarfo</span>
        </Button>
      }
    />
  );
}
