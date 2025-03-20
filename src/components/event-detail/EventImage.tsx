
import React from 'react';
import { motion } from 'framer-motion';
import { useLazyImage } from '@/utils/animations';
import { Badge } from '@/components/ui/badge';

interface EventImageProps {
  imageUrl: string;
  title: string;
  status: string;
}

const EventImage: React.FC<EventImageProps> = ({ imageUrl, title, status }) => {
  const { isLoaded, currentSrc } = useLazyImage(imageUrl);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    past: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <motion.div
      className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div 
        className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {currentSrc && (
        <img 
          src={currentSrc} 
          alt={title} 
          className="object-cover w-full h-full"
        />
      )}
      <div className="absolute top-4 right-4">
        <Badge className={`${statusColors[status]} capitalize`}>
          {status}
        </Badge>
      </div>
    </motion.div>
  );
};

export default EventImage;
