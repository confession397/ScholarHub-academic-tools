'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-md hover:shadow-lg hover:from-secondary-600 hover:to-secondary-700 hover:-translate-y-0.5 active:translate-y-0',
      outline: 'border-2 border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary hover:bg-primary-50',
      ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-7 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
