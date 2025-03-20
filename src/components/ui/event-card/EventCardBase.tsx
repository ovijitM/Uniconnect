
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EventCardBaseProps {
  children: React.ReactNode;
  className?: string;
  imageContainer?: React.ReactNode;
  footer?: React.ReactNode;
  index?: number;
}

const EventCardBase: React.FC<EventCardBaseProps> = ({ 
  children, 
  className, 
  imageContainer, 
  footer,
  index = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      <Card className="overflow-hidden h-full glass-card hover:translate-y-[-4px]">
        {imageContainer}
        <CardContent className="p-4">
          {children}
        </CardContent>
        {footer && (
          <CardFooter className="px-4 pb-4 pt-0 flex justify-between items-center">
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default EventCardBase;
