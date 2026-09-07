import * as React from 'react';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Input Variants — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const inputVariants = tv({
  base: [
    'flex w-full rounded-[10px] bg-ln-gray-0 px-3',
    'text-ln-paragraph-sm text-ln-gray-900 placeholder:text-ln-gray-400',
    'ring-1 ring-inset ring-ln-gray-200',
    'transition-all duration-200 outline-none',
    'hover:ring-ln-gray-300',
    'focus:ring-2 focus:ring-ln-gray-900',
    'disabled:pointer-events-none disabled:opacity-40',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'aria-invalid:ring-ln-red aria-invalid:focus:ring-ln-red',
    'shadow-ln-xs',
  ],
  variants: {
    size: {
      sm: 'h-8 text-ln-paragraph-xs',
      md: 'h-9',
      lg: 'h-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
