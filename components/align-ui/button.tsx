import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Button Variants — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const buttonVariants = tv({
  base: [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'rounded-[10px] font-medium outline-none transition-all duration-200',
    'focus-visible:ring-2 focus-visible:ring-ln-gray-900/30 focus-visible:ring-offset-1',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  variants: {
    variant: {
      primary: [
        'bg-ln-gray-900 text-ln-gray-0',
        'hover:bg-ln-gray-700',
        'active:bg-ln-gray-900',
        'shadow-ln-xs',
      ],
      secondary: [
        'bg-ln-gray-0 text-ln-gray-900 ring-1 ring-inset ring-ln-gray-200',
        'hover:bg-ln-gray-50 hover:ring-ln-gray-300',
        'active:bg-ln-gray-100',
        'shadow-ln-xs',
      ],
      ghost: [
        'bg-transparent text-ln-gray-700',
        'hover:bg-ln-gray-100 hover:text-ln-gray-900',
        'active:bg-ln-gray-200',
      ],
      destructive: [
        'bg-ln-red text-white',
        'hover:bg-ln-red-dark',
        'active:bg-ln-red',
        'shadow-ln-xs',
      ],
      'destructive-ghost': [
        'bg-transparent text-ln-red',
        'hover:bg-ln-red-lightest hover:text-ln-red-dark',
        'active:bg-ln-red-lightest',
      ],
      link: [
        'bg-transparent text-ln-gray-700 underline-offset-4',
        'hover:text-ln-gray-900 hover:underline',
        'h-auto px-0 py-0 shadow-none',
      ],
      // Compatibility shim — maps old Shadcn "outline" to AlignUI secondary
      outline: [
        'bg-ln-gray-0 text-ln-gray-900 ring-1 ring-inset ring-ln-gray-200',
        'hover:bg-ln-gray-50 hover:ring-ln-gray-300',
        'active:bg-ln-gray-100',
        'shadow-ln-xs',
      ],
    },
    size: {
      xs: 'h-7 px-2.5 text-ln-label-xs rounded-[8px]',
      sm: 'h-8 px-3 text-ln-label-sm',
      md: 'h-9 px-4 text-ln-label-sm',
      lg: 'h-10 px-5 text-ln-label-md',
      xl: 'h-12 px-6 text-ln-label-lg',
      icon: 'size-9',
      'icon-sm': 'size-8',
      'icon-xs': 'size-7',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
