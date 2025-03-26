
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
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
    ongoing: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300',
    past: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/40 dark:text-gray-300',
  };

  return (
    <motion.div
      className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div 
        className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {currentSrc ? (
        <img 
          src={currentSrc} 
          alt={title} 
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x400?text=Event+Image';
          }}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">No image available</p>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <Badge className={`${statusColors[status as keyof typeof statusColors] || statusColors.upcoming} capitalize`}>
          {status}
        </Badge>
      </div>
    </motion.div>
  );
};

export default EventImage;
