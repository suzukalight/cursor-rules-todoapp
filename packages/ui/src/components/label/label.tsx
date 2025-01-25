import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '../../lib/utils';

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-destructive ml-1">*</span>}
  </LabelPrimitive.Root>
));
Label.displayName = 'Label';

export { Label }; 