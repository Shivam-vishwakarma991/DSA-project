import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  className, 
  variant = 'default', 
  padding = 'md',
  children, 
  ...props 
}: CardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}