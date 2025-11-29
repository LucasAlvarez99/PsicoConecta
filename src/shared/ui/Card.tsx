// Ruta: src/shared/ui/Card.tsx
import { forwardRef } from 'react';
import { cn } from '../../shared/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-gray-200 bg-white shadow-sm',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';