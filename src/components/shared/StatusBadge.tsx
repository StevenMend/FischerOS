// src/components/shared/StatusBadge.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        statusConfig[status],
        className
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
};
