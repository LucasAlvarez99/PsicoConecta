// Ruta: src/shared/ui/Avatar.tsx
import { forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    };

    const getFallbackInitials = () => {
      if (!fallback) return '';
      const parts = fallback.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return fallback.slice(0, 2).toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-200 flex items-center justify-center',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : fallback ? (
          <span className="text-gray-700 font-medium text-sm">
            {getFallbackInitials()}
          </span>
        ) : (
          <User className={cn('text-gray-500', iconSizes[size])} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';