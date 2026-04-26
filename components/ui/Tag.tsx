'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Tag({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}: TagProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    error: 'bg-red-50 text-red-600',
    info: 'bg-blue-50 text-blue-600',
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
