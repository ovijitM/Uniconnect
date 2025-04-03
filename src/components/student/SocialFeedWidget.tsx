
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThumbsUp, MessageSquare, Share2, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { createPost, likePost } from '@/hooks/useSocialFeed';

interface SocialFeedWidgetProps {
  posts: any[];
  isLoading: boolean;
  userId: string;
  refreshFeed?: () => void;
}

const SocialFeedWidget: React.FC<SocialFeedWidgetProps> = ({ 
  posts, 
  isLoading,
  userId,
  refreshFeed
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likingPostId, setLikingPostId] = useState<string | null>(null);
  
  const handleSubmitPost = async () => {
    if (!newPostContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await createPost(userId, newPostContent);
      setNewPostContent('');
      toast.success('Post created successfully!');
      
      // Refresh the feed after posting
      if (refreshFeed) {
        refreshFeed();
      }
    } catch (error: any) {
      toast.error('Failed to create post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikePost = async (postId: string) => {
    if (likingPostId) return; // Prevent multiple simultaneous likes
    
    setLikingPostId(postId);
    try {
      const result = await likePost(userId, postId);
      
      // Update UI based on whether it was a like or unlike
      if (result && result.action === 'liked') {
        toast.success('Post liked!');
      } else if (result && result.action === 'unliked') {
        toast.success('Post unliked!');
      }
      
      // Refresh the feed after liking
      if (refreshFeed) {
        refreshFeed();
      }
    } catch (error: any) {
      toast.error('Failed to like post: ' + (error.message || 'Unknown error'));
    } finally {
      setLikingPostId(null);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={''} />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleSubmitPost} 
            disabled={!newPostContent.trim() || isSubmitting}
            size="sm"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Latest Updates</h3>
        {refreshFeed && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshFeed} 
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        )}
      </div>
      
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user?.avatar_url} />
                    <AvatarFallback>
                      {getInitials(post.user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold">{post.user?.name || 'User'}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <p className="mb-4">{post.content}</p>
                
                <div className="flex gap-4 pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleLikePost(post.id)}
                    disabled={likingPostId === post.id}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes_count || 0}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments_count || 0}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">No posts in your feed yet</p>
          <p className="text-sm text-muted-foreground">Create a post or join more clubs to see activity</p>
        </div>
      )}
    </div>
  );
};

export default SocialFeedWidget;
