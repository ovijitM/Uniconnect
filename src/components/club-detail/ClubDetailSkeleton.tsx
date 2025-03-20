
import React from 'react';
import Layout from '@/components/Layout';

const ClubDetailSkeleton: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-8 w-full max-w-4xl">
          <div className="h-80 bg-gray-200 rounded-xl"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubDetailSkeleton;
