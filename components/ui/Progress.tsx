'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  animated = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    primary: 'bg-gradient-to-r from-primary-400 to-primary-600',
    secondary: 'bg-gradient-to-r from-secondary-400 to-secondary-600',
    success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-400 to-amber-600',
    error: 'bg-gradient-to-r from-red-400 to-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">{value}</span>
          <span className="text-sm font-medium text-gray-500">{max}</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors[color],
            animated && percentage < 100 && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
