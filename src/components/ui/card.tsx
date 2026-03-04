// components/ui/card.tsx
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: React.ReactNode;
  variant?: 'base' | 'resort' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'base', 
  className 
}) => {
  const variants = {
    base: 'bg-white rounded-xl shadow-sm border border-surface-dark overflow-hidden',
    resort: 'bg-surface-light rounded-xl shadow-sm border border-surface-dark overflow-hidden',
    interactive: 'bg-white rounded-xl shadow-sm border border-surface-dark overflow-hidden hover:shadow-xl transition-all duration-300 card-interactive'
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('p-6 border-b border-surface-dark bg-gradient-to-r from-surface-light to-white', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
);