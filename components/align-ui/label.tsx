import * as React from 'react';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Label — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, optional, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'flex items-center gap-1 text-ln-label-sm text-ln-gray-700',
          'peer-disabled:opacity-70',
          className,
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-ln-red" aria-hidden="true">*</span>
        )}
        {optional && (
          <span className="text-ln-gray-400 text-ln-label-xs font-normal">(optional)</span>
        )}
      </label>
    );
  },
);
Label.displayName = 'Label';

export { Label };
