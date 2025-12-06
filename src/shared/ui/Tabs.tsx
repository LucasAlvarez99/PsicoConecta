// Ruta: src/shared/ui/Tabs.tsx
import { createContext, useContext, useState, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface TabsContextType {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs component');
  }
  return context;
};

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: string;
}

export function Tabs({ 
  value, 
  onValueChange, 
  defaultValue, 
  children, 
  className,
  ...props 
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || value);
  
  const currentValue = value || internalValue;
  const handleChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1',
          className
        )}
        {...props}
      />
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onChange } = useTabsContext();
    const isActive = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => onChange(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5',
          'text-sm font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-600 hover:text-black',
          className
        )}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    
    if (selectedValue !== value) return null;

    return (
      <div
        ref={ref}
        className={cn('mt-2 animate-fade-in', className)}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';