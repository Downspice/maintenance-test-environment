import * as React from 'react';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Textarea — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-[10px] bg-ln-gray-0 px-3 py-2',
          'text-ln-paragraph-sm text-ln-gray-900 placeholder:text-ln-gray-400',
          'ring-1 ring-inset ring-ln-gray-200 shadow-ln-xs',
          'transition-all duration-200 outline-none resize-none',
          'hover:ring-ln-gray-300',
          'focus:ring-2 focus:ring-ln-gray-900',
          'disabled:pointer-events-none disabled:opacity-40',
          'aria-invalid:ring-ln-red aria-invalid:focus:ring-ln-red',
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
