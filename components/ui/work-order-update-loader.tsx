"use client";

import { Loader2 } from "lucide-react";

interface WorkOrderUpdateLoaderProps {
  isOpen: boolean;
  message?: string;
}

/**
 * Full-screen overlay loader for work order updates.
 * Non-dismissible - blocks all user interaction until update completes.
 */
export function WorkOrderUpdateLoader({
  isOpen,
  message = "The work order is being updated. Kindly hold on.",
}: WorkOrderUpdateLoaderProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-sm"
      style={{ pointerEvents: "all" }}
    >
      <div className="glassmorphic flex flex-col items-center gap-4 p-8 bg-card">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-center text-lg font-medium text-card-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}
