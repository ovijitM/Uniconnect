
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
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
      {...props}
    />
  );
};
