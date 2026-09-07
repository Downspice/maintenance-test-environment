'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Checkbox Variants — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const checkboxVariants = tv({
  base: [
    'peer flex shrink-0 items-center justify-center rounded-[5px]',
    'ring-1 ring-inset ring-ln-gray-200 bg-ln-gray-0',
    'transition-all duration-150 outline-none',
    'hover:ring-ln-gray-400',
    'focus-visible:ring-2 focus-visible:ring-ln-gray-900',
    'data-[state=checked]:bg-ln-gray-900 data-[state=checked]:ring-ln-gray-900',
    'data-[state=indeterminate]:bg-ln-gray-900 data-[state=indeterminate]:ring-ln-gray-900',
    'disabled:pointer-events-none disabled:opacity-40',
  ],
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-[18px]',
      lg: 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <svg
        className="size-3 text-ln-gray-0"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 6L5 9L10 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

export { Checkbox };
