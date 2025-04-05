
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import SocialFeedWidget from '@/components/student/SocialFeedWidget';

interface SocialTabContentProps {
  posts: any[];
  isLoading: boolean;
  userId: string | undefined;
  refreshFeed: () => void;
}

const SocialTabContent: React.FC<SocialTabContentProps> = ({
  posts,
  isLoading,
  userId,
  refreshFeed
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Newspaper className="h-5 w-5 mr-2 text-primary" />
          Social Feed
        </h2>
        <SocialFeedWidget 
          posts={posts} 
          isLoading={isLoading}
          userId={userId}
          refreshFeed={refreshFeed}
        />
      </CardContent>
    </Card>
  );
};

export default SocialTabContent;
