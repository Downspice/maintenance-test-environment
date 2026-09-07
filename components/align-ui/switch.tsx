'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Switch Variants — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const switchVariants = tv({
  slots: {
    root: [
      'relative inline-flex shrink-0 cursor-pointer items-center rounded-full',
      'ring-2 ring-inset ring-transparent bg-ln-gray-200',
      'transition-all duration-200 outline-none',
      'focus-visible:ring-2 focus-visible:ring-ln-gray-900 focus-visible:ring-offset-2',
      'data-[state=checked]:bg-ln-gray-900',
      'disabled:pointer-events-none disabled:opacity-40',
    ],
    thumb: [
      'pointer-events-none block rounded-full bg-white shadow-sm',
      'transition-transform duration-200',
      'data-[state=checked]:translate-x-full',
    ],
  },
  variants: {
    size: {
      sm: {
        root: 'h-4 w-7',
        thumb: 'size-3 translate-x-0.5 data-[state=checked]:translate-x-3.5',
      },
      md: {
        root: 'h-5 w-9',
        thumb: 'size-4 translate-x-0.5 data-[state=checked]:translate-x-4.5',
      },
      lg: {
        root: 'h-6 w-11',
        thumb: 'size-5 translate-x-0.5 data-[state=checked]:translate-x-5.5',
      },
    },
  },
  defaultVariants: { size: 'md' },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => {
  const { root, thumb } = switchVariants({ size });
  return (
    <SwitchPrimitive.Root ref={ref} className={cn(root(), className)} {...props}>
      <SwitchPrimitive.Thumb className={thumb()} />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = 'Switch';

export { Switch };
