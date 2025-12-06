// Ruta: src/shared/ui/Dialog.tsx
import { forwardRef, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onOpenChange(false);
        }
      }}
    >
      <div className="relative w-full max-w-lg animate-fade-in">
        {children}
      </div>
    </div>
  );
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-white rounded-xl shadow-2xl border border-gray-200',
          'max-h-[90vh] overflow-y-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-gray-200',
          className
        )}
        {...props}
      />
    );
  }
);

DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-xl font-bold text-black', className)}
        {...props}
      />
    );
  }
);

DialogTitle.displayName = 'DialogTitle';

export interface DialogCloseProps {
  onClose: () => void;
}

export function DialogClose({ onClose }: DialogCloseProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      className="rounded-full"
    >
      <X className="w-4 h-4" />
    </Button>
  );
}

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      />
    );
  }
);

DialogBody.displayName = 'DialogBody';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end space-x-2 p-6 border-t border-gray-200',
          className
        )}
        {...props}
      />
    );
  }
);

DialogFooter.displayName = 'DialogFooter';