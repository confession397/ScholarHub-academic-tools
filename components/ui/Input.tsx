'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400',
            'transition-all duration-200',
            'focus:border-primary-400 focus:ring-4 focus:ring-primary-100/50',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            icon && 'pl-12',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100/50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
