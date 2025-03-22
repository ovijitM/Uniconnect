
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileImage, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  club_id: string;
}

interface ActivityPostsTabProps {
  clubId: string;
  activityPosts: ActivityPost[];
  isLoading: boolean;
  onPostActivity: (title: string, content: string, imageUrl?: string) => Promise<void>;
  onRefresh: () => void;
}

const ActivityPostsTab: React.FC<ActivityPostsTabProps> = ({
  clubId,
  activityPosts,
  isLoading,
  onPostActivity,
  onRefresh
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSending(true);
    try {
      await onPostActivity(title, content, imageUrl);
      // Clear form after successful submission
      setTitle('');
      setContent('');
      setImageUrl('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <FileImage className="mr-2 h-5 w-5" />
            Post Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe the recent activity..."
                className="min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Image URL (optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSending}>
                {isSending ? 'Posting...' : 'Post Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Activity History</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-muted/50">
              <CardContent className="p-6 h-60"></CardContent>
            </Card>
          ))}
        </div>
      ) : activityPosts.length > 0 ? (
        <div className="space-y-4">
          {activityPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{post.title}</h4>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(post.created_at), 'PPP')}
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-line mb-4">{post.content}</p>
                {post.image_url && (
                  <div className="mt-4">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="rounded-md max-h-64 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No activity posts yet. Share your club's first activity!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityPostsTab;
