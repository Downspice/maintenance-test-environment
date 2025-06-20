"use client";
import React, { useState } from "react";
import { Bell, X, AlertCircle, CheckCircle2, Info } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  type: "success" | "error" | "info";
  title: string;
  description: string;
  date: string; // ISO string
};

const iconMap = {
  success: <CheckCircle2 className="text-green-500 w-5 h-5" />,
  error: <AlertCircle className="text-red-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "info",
      title: "Order 543-2 - Oil",
      description: "6 tasks due for PD-000-01",
      date: new Date(Date.now() - 6400000).toISOString(), // 1 day ago
    },
    {
      id: 2,
      type: "info",
      title: "Employee Renewals",
      description: "23 Employee Renewals for 2025-05-01",
      date: new Date(Date.now() - 8400000).toISOString(), // 1 day ago
    },
    {
      id: 3,
      type: "info",
      title: "Reorder 543-2 - Oil",
      description: "2 tasks due for PD-000-01",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: 4,
      type: "info",
      title: "Employee Renewals",
      description: "2 Employee Renewals for 2025-05-17",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative text-foreground hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 z-10 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="w-full border-b p-3 items-end flex justify-between">
          <div className="text-md font-semibold">Notifications</div>
          <Button variant="ghost">clear All</Button>
        </div>
        <div className="max-h-[400px] overflow-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center gap-3 py-3 px-4 hover:bg-muted transition"
              >
                <div className="flex justify-center items-center">
                  {iconMap[notification.type]}
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                  className="ml-2 text-muted-foreground hover:text-destructive transition"
                  aria-label="Remove notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
