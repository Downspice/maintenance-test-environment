import * as React from 'react';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-ln-gray-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
