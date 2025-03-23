
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useLazyImage } from '@/utils/animations';
import { EventStatus } from '@/types';

interface EventCardImageProps {
  imageUrl: string;
  title: string;
  status: EventStatus;
}

const EventCardImage: React.FC<EventCardImageProps> = ({ imageUrl, title, status }) => {
  const { isLoaded, currentSrc } = useLazyImage(imageUrl);
  
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
    ongoing: 'bg-green-100 text-green-800 border-green-200',
    past: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="relative h-36 overflow-hidden">
      <div 
        className={`absolute inset-0 bg-gray-200 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {currentSrc && (
        <img
          src={currentSrc}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-700 ease-apple hover:scale-105"
        />
      )}
      <div className="absolute top-2 right-2">
        <Badge className={`${statusColors[status]} capitalize text-xs`}>
          {status}
        </Badge>
      </div>
    </div>
  );
};

export default EventCardImage;
