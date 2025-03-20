
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number; 
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  starClassName?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
  disabled = false,
  className,
  starClassName
}) => {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  
  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return;
    onChange?.(newValue);
  };
  
  const handleMouseEnter = (newValue: number) => {
    if (readOnly || disabled) return;
    setHoverValue(newValue);
  };
  
  const handleMouseLeave = () => {
    if (readOnly || disabled) return;
    setHoverValue(null);
  };
  
  const displayValue = hoverValue !== null ? hoverValue : value;
  
  return (
    <div
      className={cn("flex items-center", 
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayValue;
        
        return (
          <Star
            key={i}
            className={cn(
              "cursor-pointer transition-all duration-100",
              isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
              !readOnly && !disabled && "hover:scale-110",
              readOnly && "cursor-default",
              starClassName
            )}
            size={20}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
};
