
import React from 'react';

const ReviewsLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-2 h-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default ReviewsLoading;
