import * as React from 'react';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Badge Variants — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const badgeVariants = tv({
  base: [
    'inline-flex items-center gap-1 whitespace-nowrap rounded-full',
    'font-medium leading-none transition-colors',
  ],
  variants: {
    variant: {
      gray: 'bg-ln-gray-100 text-ln-gray-600',
      'gray-stroke': 'bg-ln-gray-0 text-ln-gray-600 ring-1 ring-inset ring-ln-gray-200',
      green: 'bg-ln-green-lightest text-ln-green-dark',
      'green-stroke': 'bg-ln-green-lightest text-ln-green-dark ring-1 ring-inset ring-ln-green-lighter',
      red: 'bg-ln-red-lightest text-ln-red-dark',
      'red-stroke': 'bg-ln-red-lightest text-ln-red-dark ring-1 ring-inset ring-ln-red-lighter',
      blue: 'bg-ln-blue-lightest text-ln-blue-dark',
      'blue-stroke': 'bg-ln-blue-lightest text-ln-blue-dark ring-1 ring-inset ring-ln-blue-lighter',
      yellow: 'bg-ln-yellow-lightest text-ln-yellow-dark',
      'yellow-stroke': 'bg-ln-yellow-lightest text-ln-yellow-dark ring-1 ring-inset ring-ln-yellow-lighter',
      orange: 'bg-ln-orange-lightest text-ln-orange-dark',
      'orange-stroke': 'bg-ln-orange-lightest text-ln-orange-dark ring-1 ring-inset ring-ln-orange-lighter',
      purple: 'bg-ln-purple-lightest text-ln-purple-dark',
      'purple-stroke': 'bg-ln-purple-lightest text-ln-purple-dark ring-1 ring-inset ring-ln-purple-lighter',
      // Shadcn compat shims
      default: 'bg-ln-gray-900 text-ln-gray-0',
      secondary: 'bg-ln-gray-100 text-ln-gray-600',
      destructive: 'bg-ln-red-lightest text-ln-red-dark',
      outline: 'bg-ln-gray-0 text-ln-gray-600 ring-1 ring-inset ring-ln-gray-200',
    },
    size: {
      sm: 'px-1.5 py-0.5 text-ln-subheading-xs',
      md: 'px-2 py-1 text-ln-subheading-xs',
      lg: 'px-2.5 py-1 text-ln-label-xs',
    },
  },
  defaultVariants: {
    variant: 'gray',
    size: 'md',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
