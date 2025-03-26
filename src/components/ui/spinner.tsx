
import React from 'react';
import { Loader2, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  className, 
  size = 16,
  ...props 
}) => {
  return (
    <Loader2 
      className={cn("animate-spin", className)} 
      size={size}
    />
  );
};
