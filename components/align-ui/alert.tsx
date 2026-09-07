import * as React from 'react';
import { tv, type VariantProps } from '@/utils/tv';
import { cn } from '@/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Alert — AlignUI Design System
// ─────────────────────────────────────────────────────────────────────────────

const alertVariants = tv({
  base: [
    'relative flex w-full gap-3 rounded-[12px] p-4',
    'ring-1 ring-inset',
    '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:mt-0.5',
  ],
  variants: {
    variant: {
      default: 'bg-ln-gray-50 ring-ln-gray-200 text-ln-gray-700 [&>svg]:text-ln-gray-500',
      info: 'bg-ln-blue-lightest ring-ln-blue-lighter text-ln-blue-dark [&>svg]:text-ln-blue',
      success: 'bg-ln-green-lightest ring-ln-green-lighter text-ln-green-dark [&>svg]:text-ln-green',
      warning: 'bg-ln-yellow-lightest ring-ln-yellow-lighter text-ln-yellow-dark [&>svg]:text-ln-yellow',
      destructive: 'bg-ln-red-lightest ring-ln-red-lighter text-ln-red-dark [&>svg]:text-ln-red',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  ),
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn('text-ln-label-sm mb-0.5', className)} {...props} />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-ln-paragraph-sm opacity-90', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
